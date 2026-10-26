/**
 * Monsters: `Mob/<id>.img` (from the `.ms` pack). See docs/data-model/mob.md.
 */
import type { WzFileSystem } from "../fs.ts";
import type { SoundData, WzNode } from "../node.ts";
import { readAnimations, resolveFrameSizes, type Animation, type ReadOptions } from "./animation.ts";
import { imageName, parseId, pad } from "./ids.ts";
import { scalars, type Scalar } from "./item.ts";
import { loadStrings } from "./strings.ts";

export interface MobAttack {
  index: number;
  fields: Record<string, Scalar>;
}

export interface MobSkillRef {
  skill: number;
  level: number;
  action?: number;
}

/** One entry of `Sound/Mob.img/<id>`, with links to another monster's audio resolved. */
export interface MobSound {
  /** Sound name: `Damage`, `Die`, `Attack1`, `CharDam1`, `Skill1`… */
  name: string;
  /** Path of the node that holds the audio (the link target for a shared sound). */
  path: string;
  durationMs: number;
  /** The monster whose audio this is, when the entry is a link to it; null for its own. */
  from: number | null;
}

export interface ElementAttribute {
  element: string;
  /** Raw level digit from `elemAttr`. */
  level: number;
  /** Readable meaning of the level (see docs/data-model/mob.md, `elemAttr`). */
  meaning: string;
}

export interface Mob {
  id: number;
  name: string;
  /** Image path of this mob. */
  path: string;
  /** Every scalar field of `info`. */
  info: Record<string, Scalar>;
  /** The mob whose sprites this one uses (`info/link`), if any. */
  link: number | null;
  /** Image path the animations were read from (differs from `path` when linked). */
  spritePath: string;
  animations: Animation[];
  attacks: MobAttack[];
  skills: MobSkillRef[];
  elements: ElementAttribute[];
  /** `Sound/Mob.img/<id>`, when that node exists. */
  soundPath: string | null;
  /** Sounds under `soundPath`, including those linked from another monster's entry. */
  sounds: MobSound[];
}

export const ELEMENT_NAMES: Record<string, string> = {
  F: "Fire",
  I: "Ice",
  L: "Lightning",
  S: "Poison",
  H: "Holy",
  D: "Dark",
  P: "Physical",
};

/** Meaning of the digit after an element letter (UNVERIFIED beyond the letters seen). */
export const ELEMENT_LEVELS: Record<number, string> = {
  1: "Immune",
  2: "Resistant",
  3: "Weak",
};

/** `"H2L2S3"` → Holy resistant, Lightning resistant, Poison weak. */
export function parseElemAttr(text: string): ElementAttribute[] {
  const out: ElementAttribute[] = [];

  for (const match of text.matchAll(/([A-Za-z])(\d)/g)) {
    const letter = match[1].toUpperCase();
    const level = Number(match[2]);

    out.push({
      element: ELEMENT_NAMES[letter] ?? letter,
      level,
      meaning: ELEMENT_LEVELS[level] ?? `level ${level}`,
    });
  }

  return out;
}

export interface MobReadOptions extends ReadOptions {
  /**
   * Read the monster's entry in `Sound/Mob.img` (default true). That image can be hundreds
   * of MB, so callers reading many monsters can read sounds separately with `readMobSounds`.
   */
  sounds?: boolean;
}

export async function readMob(fs: WzFileSystem, id: number, options: MobReadOptions = {}): Promise<Mob | null> {
  const path = `Mob/${imageName(id, "mob")}`;
  const root = await fs.get(path);

  if (!root) {
    return null;
  }

  const strings = await loadStrings(fs);
  const info = scalars(root.get("info"));
  const link = parseId(info.link);

  let spriteRoot = root;
  let spritePath = path;

  if (link !== null) {
    const linked = await fs.get(`Mob/${imageName(link, "mob")}`);

    if (linked) {
      spriteRoot = linked;
      spritePath = linked.path;
    }
  }

  const attacks: MobAttack[] = (root.get("info/attack")?.children() ?? []).map((a) => ({
    index: Number(a.name),
    fields: scalars(a),
  }));

  const skills: MobSkillRef[] = (root.get("info/skill")?.children() ?? []).map((s) => ({
    skill: s.int(0, "skill"),
    level: s.int(0, "level"),
    action: s.child("action") ? s.int(0, "action") : undefined,
  }));

  const animations = readAnimations(spriteRoot);

  if (options.frameSizes ?? true) {
    await resolveFrameSizes(fs, animations);
  }

  const sound = options.sounds === false ? null : await readMobSounds(fs, id);

  return {
    id,
    name: strings.mobs.get(id) ?? "",
    path,
    info,
    link,
    spritePath,
    animations,
    attacks,
    skills,
    elements: typeof info.elemAttr === "string" ? parseElemAttr(info.elemAttr) : [],
    soundPath: sound ? sound.path : null,
    sounds: sound ? sound.sounds : [],
  };
}

/** A monster's entry in `Sound/Mob.img`, or null when it has none. */
export async function readMobSounds(fs: WzFileSystem, id: number): Promise<{ path: string; sounds: MobSound[] } | null> {
  const entry = await fs.get(`Sound/Mob.img/${pad(id, 7)}`);

  return entry ? { path: entry.path, sounds: readSounds(entry) } : null;
}

/**
 * Many entries borrow another monster's audio: their children are UOLs such as
 * `../0000002/Damage` (Blue Snail → Snail). See docs/data-model/mob.md.
 */
function readSounds(entry: WzNode): MobSound[] {
  const out: MobSound[] = [];

  for (const child of entry.children()) {
    const target = child.resolve();

    if (target?.kind !== "sound") {
      continue;
    }

    const owner = target.parent?.name;

    out.push({
      name: child.name,
      path: target.path,
      durationMs: (target.value as SoundData).durationMs,
      from: child.kind === "uol" && owner && owner !== entry.name ? parseId(owner) : null,
    });
  }

  return out;
}

/** IDs of every mob image. */
export function mobIds(fs: WzFileSystem): number[] {
  return [...fs.imagesUnder("Mob")]
    .filter((i) => /^Mob\/\d+\.img$/.test(i.path))
    .map((i) => Number(i.name.replace(".img", "")));
}
