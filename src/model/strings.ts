/**
 * Names and texts from the String tree. See docs/data-model/string.md.
 */
import type { WzFileSystem } from "../fs.ts";
import type { WzNode } from "../node.ts";

export interface NamedText {
  name: string;
  desc?: string;
}

export interface NpcText {
  name: string;
  func?: string;
  /** Every other string field (speech lines n0, s0, d0, …), keyed by field name. */
  lines: Record<string, string>;
}

export interface MapText {
  region: string;
  streetName: string;
  mapName: string;
  mapDesc?: string;
}

export interface SkillText {
  name?: string;
  desc?: string;
  /** Job book name, for job entries (e.g. `000` → "Beginner's Basics"). */
  bookName?: string;
  /** Level texts h1, h2, … and other per-skill strings, keyed by field name. */
  extra: Record<string, string>;
}

export interface StringTables {
  /** Equip names, keyed by item ID; also records the slot folder name. */
  equips: Map<number, NamedText & { slot: string }>;
  /** Use, Etc, Setup, Cash and Pet item names, keyed by item ID. */
  items: Map<number, NamedText & { category: string }>;
  mobs: Map<number, string>;
  npcs: Map<number, NpcText>;
  maps: Map<number, MapText>;
  skills: Map<number, SkillText>;
}

let cache: WeakMap<WzFileSystem, Promise<StringTables>> = new WeakMap();

/** Loads every name table once per mounted file system. */
export function loadStrings(fs: WzFileSystem): Promise<StringTables> {
  let tables = cache.get(fs);

  if (!tables) {
    tables = readStrings(fs);
    cache.set(fs, tables);
  }

  return tables;
}

/** Drops cached tables (tests). */
export function resetStringCache(): void {
  cache = new WeakMap();
}

async function readStrings(fs: WzFileSystem): Promise<StringTables> {
  const tables: StringTables = {
    equips: new Map(),
    items: new Map(),
    mobs: new Map(),
    npcs: new Map(),
    maps: new Map(),
    skills: new Map(),
  };

  // Equips: String/Eqp.img/<group>/<Slot>/<id> (the group is "ClassicWorld" in this client).
  const eqp = await fs.get("String/Eqp.img");

  for (const group of eqp?.children() ?? []) {
    for (const slot of group.children()) {
      for (const entry of slot.children()) {
        const id = Number(entry.name);

        if (Number.isSafeInteger(id)) {
          tables.equips.set(id, { slot: slot.name, ...namedText(entry) });
        }
      }
    }
  }

  // Bundled items. Etc keeps an extra "Etc" level; the others list IDs at the top.
  const itemImages: [string, string][] = [
    ["String/Consume.img", "Use"],
    ["String/Etc.img", "Etc"],
    ["String/Ins.img", "Setup"],
    ["String/Cash.img", "Cash"],
    ["String/Pet.img", "Pet"],
  ];

  for (const [path, category] of itemImages) {
    const root = await fs.get(path);

    for (const entry of flattenIds(root)) {
      tables.items.set(Number(entry.name), { category, ...namedText(entry) });
    }
  }

  for (const entry of (await fs.get("String/Mob.img"))?.children() ?? []) {
    tables.mobs.set(Number(entry.name), entry.string("", "name"));
  }

  for (const entry of (await fs.get("String/Npc.img"))?.children() ?? []) {
    const lines: Record<string, string> = {};

    for (const field of entry.children()) {
      if (field.kind === "string" && field.name !== "name" && field.name !== "func") {
        lines[field.name] = field.value as string;
      }
    }

    tables.npcs.set(Number(entry.name), {
      name: entry.string("", "name"),
      func: entry.string("", "func") || undefined,
      lines,
    });
  }

  for (const region of (await fs.get("String/Map.img"))?.children() ?? []) {
    for (const entry of region.children()) {
      tables.maps.set(Number(entry.name), {
        region: region.name,
        streetName: entry.string("", "streetName"),
        mapName: entry.string("", "mapName"),
        mapDesc: entry.string("", "mapDesc") || undefined,
      });
    }
  }

  for (const entry of (await fs.get("String/Skill.img"))?.children() ?? []) {
    const extra: Record<string, string> = {};

    for (const field of entry.children()) {
      if (field.kind === "string" && !["name", "desc", "bookName"].includes(field.name)) {
        extra[field.name] = field.value as string;
      }
    }

    tables.skills.set(Number(entry.name), {
      name: entry.string("", "name") || undefined,
      desc: entry.string("", "desc") || undefined,
      bookName: entry.string("", "bookName") || undefined,
      extra,
    });
  }

  return tables;
}

/** Entries whose names are numeric IDs, descending through one non-numeric wrapper level. */
function flattenIds(root: WzNode | undefined): WzNode[] {
  const out: WzNode[] = [];

  for (const child of root?.children() ?? []) {
    if (/^\d+$/.test(child.name)) {
      out.push(child);
    } else {
      out.push(...child.children().filter((c) => /^\d+$/.test(c.name)));
    }
  }

  return out;
}

function namedText(node: WzNode): NamedText {
  return {
    name: node.string("", "name"),
    desc: node.string("", "desc") || undefined,
  };
}
