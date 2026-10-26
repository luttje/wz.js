/**
 * Skills and jobs: `Skill/<job>.img` (from the `.ms` pack). Job IDs are three digits
 * (`000` Beginner, `100` Warrior, `110` Fighter, …); skill IDs are `job * 10000 + n`.
 * See docs/data-model/skill.md.
 */
import type { WzFileSystem } from "../fs.ts";
import type { Vector, WzNode } from "../node.ts";
import { readAnimation, resolveFrameSizes, type Animation, type ReadOptions } from "./animation.ts";
import { evaluate, isFormula } from "./formula.ts";
import { jobOfSkill, pad } from "./ids.ts";
import { canvasPath, scalars, type Scalar } from "./item.ts";
import { loadStrings } from "./strings.ts";

export type LevelValue = number | string | Vector;

export interface Skill {
  id: number;
  job: number;
  path: string;
  name: string;
  desc?: string;
  /** Per-level text lines (`h1`, `h2`, … or `h`), by field name. */
  levelText: Record<string, string>;
  icon?: string;
  iconMouseOver?: string;
  iconDisabled?: string;
  maxLevel: number;
  /** Where the level values came from. */
  levelSource: "level" | "common" | "none";
  /** Values for levels 1..maxLevel (index 0 = level 1). */
  levels: Record<string, LevelValue>[];
  /** Raw `common` formulas, when present. */
  formulas: Record<string, string>;
  /** Required skills: `req/<skillId> = level`. */
  required: { id: number; level: number }[];
  info: Record<string, Scalar>;
  /** Other scalar fields on the skill node (weapon, action, psd, invisible, …). */
  fields: Record<string, Scalar>;
  /** Effect animations: effect, effect0…, hit/<n>, ball, affected, mob, special, … */
  effects: Animation[];
  /**
   * Effects stored per level (`level/<n>/ball`, `level/<n>/hit/<k>`), by level (index 0 =
   * level 1). Three Snails throws a different shell at each level.
   */
  levelEffects: Animation[][];
}

/** A job's skill book: `Skill/<job>.img` with its title and every skill in it. */
export interface SkillBook {
  job: number;
  name: string;
  icon?: string;
  skills: Skill[];
}

export interface Job {
  id: number;
  name: string;
  icon?: string;
  skills: number[];
}

const EFFECT_NODES = /^(effect\d*|ball|affected\d*|mob|special\d*|prepare|keydown\d*|keydownend|repeat|tile|screen\d*|finish\d*|hit)$/;

export async function readSkill(fs: WzFileSystem, id: number, options: ReadOptions = {}): Promise<Skill | null> {
  const job = jobOfSkill(id);
  const path = `Skill/${pad(job, 3)}.img/skill/${pad(id, 7)}`;
  const node = await fs.get(path);

  if (!node) {
    return null;
  }

  const skill = skillFromNode(node, id, (await loadStrings(fs)).skills.get(id));

  if (options.frameSizes ?? true) {
    await resolveFrameSizes(fs, [...skill.effects, ...skill.levelEffects.flat()]);
  }

  return skill;
}

/** Reads a job's skill book (`null` when the job has no image). */
export async function readSkillBook(fs: WzFileSystem, job: number): Promise<SkillBook | null> {
  const root = await fs.get(`Skill/${pad(job, 3)}.img`);

  if (!root) {
    return null;
  }

  const strings = await loadStrings(fs);
  const skills: Skill[] = [];

  for (const child of root.get("skill")?.children() ?? []) {
    const id = Number(child.name);
    const skill = Number.isSafeInteger(id) ? skillFromNode(child, id, strings.skills.get(id)) : null;

    if (skill) {
      skills.push(skill);
    }
  }

  await resolveFrameSizes(fs, skills.flatMap((s) => [...s.effects, ...s.levelEffects.flat()]));

  return {
    job,
    name: strings.skills.get(job)?.bookName ?? "",
    icon: canvasPath(root, "info/icon"),
    skills: skills.sort((a, b) => a.id - b.id),
  };
}

export function skillFromNode(node: WzNode, id: number, text?: { name?: string; desc?: string; extra: Record<string, string> }): Skill {
  const formulas: Record<string, string> = {};

  for (const child of node.get("common")?.children() ?? []) {
    if (child.kind === "string" || typeof child.value === "number") {
      formulas[child.name] = String(child.value);
    }
  }

  const levelNodes = (node.get("level")?.children() ?? [])
    .filter((c) => /^\d+$/.test(c.name))
    .sort((a, b) => Number(a.name) - Number(b.name));

  let levelSource: Skill["levelSource"] = "none";
  let levels: Record<string, LevelValue>[] = [];
  const levelEffects: Animation[][] = levelNodes.map((level) => effectsOf(level));

  if (levelNodes.length > 0) {
    levelSource = "level";
    levels = levelNodes.map((level, i) => {
      const values: Record<string, LevelValue> = {};

      // Next to `level/<n>`, `common` holds what every level shares (MP Eater's `cooltime 5`,
      // Slash Blast's `mobCount 6`); a level's own value wins.
      for (const [key, formula] of Object.entries(formulas)) {
        if (key !== "maxLevel") {
          values[key] = computeFormula(formula, Number(level.name) || i + 1);
        }
      }

      for (const field of level.children()) {
        const v = field.resolve();

        if (v?.kind === "vector") {
          values[field.name] = v.value as Vector;
        } else if (typeof v?.value === "number" || typeof v?.value === "string") {
          values[field.name] = v.value;
        }
      }

      return values;
    });
  } else if ("maxLevel" in formulas) {
    levelSource = "common";

    const maxLevel = Number(formulas.maxLevel);

    for (let x = 1; x <= maxLevel; x++) {
      const values: Record<string, LevelValue> = {};

      for (const [key, formula] of Object.entries(formulas)) {
        if (key === "maxLevel") {
          continue;
        }

        values[key] = computeFormula(formula, x);
      }

      levels.push(values);
    }
  }

  const fields: Record<string, Scalar> = {};

  for (const child of node.children()) {
    if (typeof child.value === "number" || (child.kind === "string" && child.name !== "action")) {
      fields[child.name] = child.value as Scalar;
    }
  }

  const action = node.get("action");

  if (action?.kind === "string") {
    fields.action = action.value as string;
  } else if (action) {
    fields.action = action
      .children()
      .map((a) => a.string())
      .join(", ");
  }

  const effects = effectsOf(node);

  return {
    id,
    job: jobOfSkill(id),
    path: node.path,
    name: text?.name ?? "",
    desc: text?.desc,
    levelText: text?.extra ?? {},
    icon: canvasPath(node, "icon"),
    iconMouseOver: canvasPath(node, "iconMouseOver"),
    iconDisabled: canvasPath(node, "iconDisabled"),
    maxLevel: levels.length,
    levelSource,
    levels,
    formulas,
    required: (node.get("req")?.children() ?? []).map((r) => ({ id: Number(r.name), level: r.int(0) })),
    info: scalars(node.get("info")),
    fields,
    effects,
    levelEffects,
  };
}

/** The effect animations directly under a skill (or skill level) node. */
function effectsOf(node: WzNode): Animation[] {
  const effects: Animation[] = [];

  for (const child of node.children()) {
    if (!EFFECT_NODES.test(child.name)) {
      continue;
    }

    const target = child.resolve();

    if (!target) {
      continue;
    }

    if (child.name === "hit") {
      // `hit/<n>` holds one animation per hit index.
      for (const sub of target.children()) {
        const anim = sub.resolve();

        if (anim) {
          effects.push({ ...readAnimation(anim), name: `hit/${sub.name}` });
        }
      }

      continue;
    }

    const anim = readAnimation(target);

    if (anim.frames.length > 0) {
      effects.push({ ...anim, name: child.name });
    }
  }

  return effects;
}

/** Evaluates a formula for level `x`; plain numbers pass through; failures keep the text. */
export function computeFormula(formula: string, x: number): number | string {
  if (!isFormula(formula)) {
    const n = Number(formula);

    return Number.isFinite(n) ? n : formula;
  }

  if (UNSUPPORTED_FORMULAS.has(formula)) {
    return formula;
  }

  try {
    return evaluate(formula, x);
  } catch {
    // Remembered, so the same formula isn't parsed and thrown again for every level.
    UNSUPPORTED_FORMULAS.add(formula);

    return formula;
  }
}

/** Formulas the evaluator can't handle. */
const UNSUPPORTED_FORMULAS = new Set<string>();

export async function readJobs(fs: WzFileSystem): Promise<Job[]> {
  const jobs: Job[] = [];

  for (const path of jobImagePaths(fs)) {
    jobs.push(await readJob(fs, path));
  }

  return jobs.sort((a, b) => a.id - b.id);
}

/** Paths of the job images (`Skill/100.img`, …), in tree order, without loading them. */
export function jobImagePaths(fs: WzFileSystem): string[] {
  return [...fs.imagesUnder("Skill")].map((i) => i.path).filter((p) => /^Skill\/\d+\.img$/.test(p));
}

/** One job from its image (a path from `jobImagePaths`). */
export async function readJob(fs: WzFileSystem, path: string): Promise<Job> {
  const image = fs.image(path);

  if (!image) {
    throw new Error(`not found: ${path}`);
  }

  const strings = await loadStrings(fs);
  const id = Number(image.name.replace(".img", ""));
  const root = await image.load();

  return {
    id,
    name: strings.skills.get(id)?.bookName ?? `Job ${pad(id, 3)}`,
    icon: canvasPath(root, "info/icon"),
    skills: (root.get("skill")?.children() ?? []).map((s) => Number(s.name)).sort((a, b) => a - b),
  };
}
