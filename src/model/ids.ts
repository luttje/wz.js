/**
 * ID conventions. See docs/quirks.md ("Zero-padding differs between images and strings").
 *
 * Models use plain numbers. Image names are zero-padded to a fixed width per kind, while
 * String images and cross-references (quests, map `life`) use the unpadded number.
 */

export const ID_WIDTH = {
  mob: 7,
  npc: 7,
  map: 9,
  skill: 7,
  item: 8,
  reactor: 7,
  pet: 7,
  job: 3,
} as const;

export type EntityType = "item" | "mob" | "npc" | "map" | "quest" | "skill" | "reactor";

export function pad(id: number, width: number): string {
  return String(id).padStart(width, "0");
}

/** Parses an ID from a route or data string ("0000002", "2", " 2 "). */
export function parseId(text: string | number | undefined): number | null {
  if (text === undefined) {
    return null;
  }

  const n = Number(String(text).trim());

  return Number.isSafeInteger(n) && n >= 0 ? n : null;
}

/** Image file name for an ID, e.g. `imageName(2, "mob")` → `0000002.img`. */
export function imageName(id: number, kind: keyof typeof ID_WIDTH): string {
  return `${pad(id, ID_WIDTH[kind])}.img`;
}

/** Skill IDs encode their job: `floor(id / 10000)`. */
export function jobOfSkill(skillId: number): number {
  return Math.floor(skillId / 10000);
}
