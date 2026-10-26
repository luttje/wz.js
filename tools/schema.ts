/**
 * `npm run schema -- [kind…] [--out <dir>]`: field statistics for every kind of entity, written
 * to `<dir>/<kind>.md` (default docs/data-model/generated). Only the section between the
 * `generated:schema` markers is replaced. The `Data` folder comes from `--data` or `WZ_DATA`.
 *
 * For each kind, every unit (an image, or a sub-node such as one skill) is walked. Field
 * paths are generalised: numeric segments become `<n>`. For each field it records the types
 * seen, how many units have it, numeric min/max and up to five short sample strings.
 * Output never contains pixels, audio or long text.
 */
import { join, resolve } from "node:path";

import type { WzFileSystem } from "../src/fs.ts";
import type { WzNode } from "../src/node.ts";
import { args, mountData, outOption, PROJECT_ROOT } from "./lib/data.ts";
import { table, writeGeneratedSection } from "./lib/markdown.ts";

interface Kind {
  name: string;
  title: string;
  /** Directory to scan. */
  root: string;
  /** Image paths belonging to this kind. */
  images: RegExp;
  /** Optional sub-path whose children are the units (e.g. `skill` → each skill). */
  unitsAt?: string;
  /** Only walk this child of each unit (e.g. `info`). */
  only?: string;
}

export const KINDS: Kind[] = [
  { name: "mob", title: "Monsters (Mob/<id>.img)", root: "Mob", images: /^Mob\/\d+\.img$/ },
  { name: "npc", title: "NPCs (Npc/<id>.img)", root: "Npc", images: /^Npc\/\d+\.img$/ },
  { name: "map", title: "Maps (Map/Map/Map<N>/<id>.img)", root: "Map/Map", images: /^Map\/Map\/Map\d\/\d+\.img$/ },
  { name: "quest", title: "Quests (Quest/QuestData/<id>.img)", root: "Quest/QuestData", images: /^Quest\/QuestData\/\d+\.img$/ },
  { name: "skill", title: "Skills (Skill/<job>.img/skill/<id>)", root: "Skill", images: /^Skill\/\d+\.img$/, unitsAt: "skill" },
  { name: "job", title: "Job images (Skill/<job>.img, excluding skills)", root: "Skill", images: /^Skill\/\d+\.img$/ },
  { name: "mobskill", title: "Mob skills (Skill/MobSkill/<id>.img)", root: "Skill/MobSkill", images: /^Skill\/MobSkill\/\d+\.img$/ },
  { name: "equip", title: "Equips (Character/<Slot>/<id>.img)", root: "Character", images: /^Character\/(?!_Canvas)[A-Za-z]+\/\d+\.img$/ },
  { name: "equip-info", title: "Equip info (Character/<Slot>/<id>.img/info)", root: "Character", images: /^Character\/(?!_Canvas|Hair|Face)[A-Za-z]+\/\d+\.img$/, only: "info" },
  { name: "body", title: "Body and head (Character/<id>.img)", root: "Character", images: /^Character\/\d+\.img$/ },
  { name: "item", title: "Bundled items (Item/<Category>/<prefix>.img/<id>)", root: "Item", images: /^Item\/(Consume|Etc|Install|Cash|Special)\/\d+\.img$/, unitsAt: "" },
  { name: "pet", title: "Pets (Item/Pet/<id>.img)", root: "Item/Pet", images: /^Item\/Pet\/\d+\.img$/ },
  { name: "reactor", title: "Reactors (Reactor/<id>.img)", root: "Reactor", images: /^Reactor\/\d+\.img$/ },
  { name: "map-back", title: "Backgrounds (Map/Back/<set>.img)", root: "Map/Back", images: /^Map\/Back\/[^/]+\.img$/ },
  { name: "map-obj", title: "Objects (Map/Obj/<set>.img)", root: "Map/Obj", images: /^Map\/Obj\/[^/]+\.img$/ },
  { name: "map-tile", title: "Tiles (Map/Tile/<set>.img)", root: "Map/Tile", images: /^Map\/Tile\/[^/]+\.img$/ },
];

const MAX_ROWS = 500;
const SAMPLE_MAX_LENGTH = 40;

interface FieldStat {
  types: Set<string>;
  units: number;
  lastUnit: number;
  min: number;
  max: number;
  samples: Set<string>;
}

async function generate(fs: WzFileSystem, kind: Kind, outDir: string): Promise<void> {
  const fields = new Map<string, FieldStat>();
  let unitIndex = 0;
  const examples: string[] = [];

  const visit = (node: WzNode, prefix: string) => {
    for (const child of node.children()) {
      const segment = /^-?\d+$/.test(child.name) ? "<n>" : child.name;
      const path = prefix ? `${prefix}/${segment}` : segment;

      // In the "job" kind, the skills are covered by the "skill" kind.
      if (kind.name === "job" && path === "skill") {
        continue;
      }

      let stat = fields.get(path);

      if (!stat) {
        stat = { types: new Set(), units: 0, lastUnit: -1, min: Infinity, max: -Infinity, samples: new Set() };
        fields.set(path, stat);
      }

      stat.types.add(child.kind);

      if (stat.lastUnit !== unitIndex) {
        stat.lastUnit = unitIndex;
        stat.units++;
      }

      const v = child.value;

      if (typeof v === "number") {
        stat.min = Math.min(stat.min, v);
        stat.max = Math.max(stat.max, v);
      } else if (typeof v === "string") {
        const n = Number(v);

        if (v.trim() !== "" && Number.isFinite(n)) {
          stat.min = Math.min(stat.min, n);
          stat.max = Math.max(stat.max, n);
        } else if (v.length <= SAMPLE_MAX_LENGTH && stat.samples.size < 5) {
          stat.samples.add(v);
        }
      }

      // Canvases' children (origin, delay, …) are fields too.
      if (child.childCount > 0) {
        visit(child, path);
      }
    }
  };

  for (const image of fs.imagesUnder(kind.root)) {
    if (!kind.images.test(image.path)) {
      continue;
    }

    const root = await image.load();
    const units = kind.unitsAt === undefined ? [root] : (kind.unitsAt ? root.get(kind.unitsAt)?.children() ?? [] : root.children());

    for (const unit of units) {
      if (kind.only) {
        const part = unit.get(kind.only);

        if (part) {
          visit(part, kind.only);
        }
      } else {
        visit(unit, "");
      }

      unitIndex++;

      if (examples.length < 3) {
        examples.push(kind.unitsAt === undefined ? image.path : unit.path);
      }
    }

    image.unload();
  }

  const rows = [...fields.entries()]
    .sort((a, b) => b[1].units - a[1].units || a[0].localeCompare(b[0]))
    .slice(0, MAX_ROWS)
    .map(([path, s]) => [
      `\`${path}\``,
      [...s.types].join(", "),
      s.units,
      `${((100 * s.units) / Math.max(1, unitIndex)).toFixed(1)}%`,
      Number.isFinite(s.min) ? (s.min === s.max ? `${s.min}` : `${s.min} … ${s.max}`) : "",
      [...s.samples].map((x) => `\`${x.replaceAll("|", "\\|").replaceAll("`", "'")}\``).join(", "),
    ]);

  const header = [
    `Units: **${unitIndex}**. Examples: ${examples.map((e) => `\`${e}\``).join(", ")}.`,
    fields.size > MAX_ROWS ? `Showing the ${MAX_ROWS} most common of ${fields.size} field paths.` : `${fields.size} field paths.`,
    "Numeric path segments are shown as `<n>`. Range covers numbers and numeric strings.",
  ].join("\n\n");

  const out = join(outDir, `${kind.name}.md`);

  await writeGeneratedSection(out, "schema", `${header}\n\n${table(["Field", "Types", "Units", "%", "Range", "Samples"], rows)}`, kind.title);
  console.log(`${kind.name}: ${unitIndex} units, ${fields.size} fields`);
}

async function main(): Promise<void> {
  const outDir = outOption ? resolve(outOption) : join(PROJECT_ROOT, "docs", "data-model", "generated");
  const wanted = args;
  const data = await mountData({ maxLoadedImages: 32 });

  try {
    for (const kind of KINDS) {
      if (wanted.length === 0 || wanted.includes(kind.name)) {
        await generate(data.fs, kind, outDir);
      }
    }
  } finally {
    await data.close();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
