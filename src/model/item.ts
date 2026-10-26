/**
 * Items: equips (`Character/<Slot>/<id>.img`), bundled items
 * (`Item/<Category>/<prefix>.img/<id>`) and pets (`Item/Pet/<id>.img`).
 * See docs/data-model/item.md.
 */
import type { WzFileSystem } from "../fs.ts";
import type { WzNode } from "../node.ts";
import { loadStrings } from "./strings.ts";

export type ItemCategory = "Equip" | "Use" | "Etc" | "Setup" | "Cash" | "Pet";

export interface ItemLocation {
  id: number;
  category: ItemCategory;
  /** Equip folder (Cap, Coat, Weapon, …) for equips. */
  slot?: string;
  /** Node holding `info` (and `spec`): the equip/pet image, or the item's node in a bundle. */
  path: string;
}

export type Scalar = number | string;

export interface Item extends ItemLocation {
  name: string;
  desc?: string;
  /** Canvas paths (follow links when decoding). */
  icon?: string;
  iconRaw?: string;
  /** Every scalar field of `info`, by its raw name. */
  info: Record<string, Scalar>;
  /** Every scalar field of `spec` (consumable effects), when present. */
  spec?: Record<string, Scalar>;
  cash: boolean;
  /** Equip sub-type label (e.g. "One-handed Sword", "Earrings"), when known. */
  subtype?: string;
}

/** Equip folders that hold wearable items (Hair, Face and Afterimage are not items). */
export const EQUIP_FOLDERS = [
  "Cap",
  "Accessory",
  "Coat",
  "Longcoat",
  "Pants",
  "Shoes",
  "Glove",
  "Shield",
  "Cape",
  "Ring",
  "Weapon",
  "PetEquip",
  "TamingMob",
];

const BUNDLE_FOLDERS: [string, ItemCategory][] = [
  ["Consume", "Use"],
  ["Etc", "Etc"],
  ["Install", "Setup"],
  ["Cash", "Cash"],
  ["Special", "Etc"],
];

/** Weapon types by `floor(id / 10000)`. Derived from the ID scheme; checked against names. */
export const WEAPON_TYPES: Record<number, string> = {
  130: "One-handed Sword",
  131: "One-handed Axe",
  132: "One-handed Blunt Weapon",
  133: "Dagger",
  137: "Wand",
  138: "Staff",
  140: "Two-handed Sword",
  141: "Two-handed Axe",
  142: "Two-handed Blunt Weapon",
  143: "Spear",
  144: "Polearm",
  145: "Bow",
  146: "Crossbow",
  147: "Claw",
  148: "Knuckle",
  149: "Gun",
};

/** Accessory types by `floor(id / 10000)`. */
export const ACCESSORY_TYPES: Record<number, string> = {
  101: "Face Accessory",
  102: "Eye Accessory",
  103: "Earrings",
  111: "Ring",
  112: "Pendant",
  113: "Belt",
  114: "Medal",
  115: "Shoulder",
};

/** Required-job bit flags in `info/reqJob`. 0 means any job. */
export const JOB_FLAGS: [number, string][] = [
  [1, "Warrior"],
  [2, "Magician"],
  [4, "Bowman"],
  [8, "Thief"],
  [16, "Pirate"],
];

export function jobNames(reqJob: number): string[] {
  if (!reqJob) {
    return [];
  }

  if (reqJob < 0) {
    return ["Beginner"];
  }

  return JOB_FLAGS.filter(([bit]) => reqJob & bit).map(([, name]) => name);
}

export function equipSubtype(id: number, slot: string | undefined): string | undefined {
  const group = Math.floor(id / 10000);

  return WEAPON_TYPES[group] ?? ACCESSORY_TYPES[group] ?? slot;
}

/**
 * An image that holds items: one item (an equip or pet image) or many (a bundle such as
 * `Item/Consume/0200.img`, one item per numbered child).
 */
export interface ItemImage {
  path: string;
  category: ItemCategory;
  /** Equip folder, for equips. */
  slot?: string;
  bundle: boolean;
}

let locatorCache = new WeakMap<WzFileSystem, Promise<Map<number, ItemLocation>>>();

/** Every item's location, keyed by ID (built once per file system). */
export function itemLocations(fs: WzFileSystem): Promise<Map<number, ItemLocation>> {
  let locations = locatorCache.get(fs);

  if (!locations) {
    locations = locateItems(fs);
    locatorCache.set(fs, locations);
  }

  return locations;
}

/**
 * Every image that holds items, in lookup order (equips, bundles, pets), without loading
 * any. When an ID occurs twice, the later location wins (see `itemLocations`).
 */
export function itemImages(fs: WzFileSystem): ItemImage[] {
  const out: ItemImage[] = [];

  const add = (folder: string, category: ItemCategory, bundle: boolean, slot?: string) => {
    for (const image of fs.imagesUnder(folder)) {
      if (image.path.includes("/_Canvas/")) {
        continue;
      }

      out.push(slot === undefined ? { path: image.path, category, bundle } : { path: image.path, category, slot, bundle });
    }
  };

  for (const slot of EQUIP_FOLDERS) {
    add(`Character/${slot}`, "Equip", false, slot);
  }

  for (const [folder, category] of BUNDLE_FOLDERS) {
    add(`Item/${folder}`, category, true);
  }

  add("Item/Pet", "Pet", false);

  return out;
}

/** The items one image holds, in order. Bundles are loaded to list their entries. */
export async function imageItems(fs: WzFileSystem, image: ItemImage): Promise<ItemLocation[]> {
  if (!image.bundle) {
    const id = Number(lastSegment(image.path).replace(/\.img$/, ""));

    if (!Number.isSafeInteger(id)) {
      return [];
    }

    return image.slot === undefined
      ? [{ id, category: image.category, path: image.path }]
      : [{ id, category: image.category, slot: image.slot, path: image.path }];
  }

  const root = await fs.get(image.path);
  const out: ItemLocation[] = [];

  for (const entry of root?.children() ?? []) {
    const id = Number(entry.name);

    if (Number.isSafeInteger(id)) {
      out.push({ id, category: image.category, path: entry.path });
    }
  }

  return out;
}

async function locateItems(fs: WzFileSystem): Promise<Map<number, ItemLocation>> {
  const out = new Map<number, ItemLocation>();

  for (const image of itemImages(fs)) {
    for (const location of await imageItems(fs, image)) {
      out.set(location.id, location);
    }
  }

  return out;
}

export async function readItem(fs: WzFileSystem, id: number): Promise<Item | null> {
  const location = (await itemLocations(fs)).get(id);

  return location ? readItemAt(fs, location) : null;
}

/** Reads the item at a known location (from `itemLocations` or `imageItems`). */
export async function readItemAt(fs: WzFileSystem, location: ItemLocation): Promise<Item | null> {
  const id = location.id;
  const node = await fs.get(location.path);

  if (!node) {
    return null;
  }

  const strings = await loadStrings(fs);
  const text = location.category === "Equip" ? strings.equips.get(id) : strings.items.get(id);
  const info = scalars(node.get("info"));
  const specNode = node.get("spec");

  return {
    ...location,
    name: text?.name ?? "",
    desc: text?.desc,
    icon: canvasPath(node, "info/icon"),
    iconRaw: canvasPath(node, "info/iconRaw"),
    info,
    spec: specNode ? scalars(specNode) : undefined,
    cash: Number(info.cash ?? 0) === 1 || location.category === "Cash",
    subtype: location.category === "Equip" ? equipSubtype(id, location.slot) : undefined,
  };
}

function lastSegment(path: string): string {
  return path.slice(path.lastIndexOf("/") + 1);
}

/** Path of a canvas (UOLs resolved), or undefined. */
export function canvasPath(node: WzNode, path: string): string | undefined {
  const target = node.get(path);

  return target?.kind === "canvas" ? target.path : undefined;
}

/** Scalar children of a node (strings and numbers), by name. */
export function scalars(node: WzNode | undefined): Record<string, Scalar> {
  const out: Record<string, Scalar> = {};

  for (const child of node?.children() ?? []) {
    const v = child.resolve()?.value;

    if (typeof v === "number" || typeof v === "string") {
      out[child.name] = v;
    }
  }

  return out;
}
