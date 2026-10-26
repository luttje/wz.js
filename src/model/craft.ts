/**
 * Crafting recipes: `Etc/CraftRecipe.img/<profession>/<craft level>/<n>`, six professions
 * (0 Smithing … 5 Arcforging), each recipe with its ingredients, meso cost, result and the
 * crafting EXP it gives. `Conditions/SkillCheck` names the profession's skill and the level
 * the recipe needs; `AdditiveItemID` is an optional stimulator for equipment.
 */
import type { WzFileSystem } from "../fs.ts";

export interface CraftRecipe {
  /** `<profession>/<level>/<n>`, unique. */
  key: string;
  profession: number;
  /** The profession's skill (92000000 + profession × 10000). */
  skill: number;
  /** The crafting level the recipe needs. */
  level: number;
  meso: number;
  /** How long crafting takes. */
  timeMs: number;
  ingredients: { item: number; count: number }[];
  result: { item: number; count: number };
  /** Crafting EXP a craft gives. */
  exp: number;
  /** An optional item that can be added (an equipment stimulator), and how many. */
  additive?: { item: number; count: number };
}

export async function readCraftRecipes(fs: WzFileSystem): Promise<CraftRecipe[]> {
  const root = await fs.get("Etc/CraftRecipe.img");
  const recipes: CraftRecipe[] = [];

  for (const profession of root?.children() ?? []) {
    for (const level of profession.children()) {
      for (const r of level.children()) {
        const additive = r.int(0, "AdditiveItemID");

        recipes.push({
          key: `${profession.name}/${level.name}/${r.name}`,
          profession: Number(profession.name),
          skill: r.int(0, "Conditions/SkillCheck/SkillID"),
          level: r.int(Number(level.name), "Conditions/SkillCheck/reqSkillLevel"),
          meso: r.int(0, "Meso"),
          timeMs: r.int(0, "ProcessTimeMS"),
          ingredients: (r.get("Ingredients")?.children() ?? []).map((i) => ({ item: i.int(0, "item"), count: i.int(1, "count") })),
          result: { item: r.int(0, "Results/item"), count: r.int(1, "Results/count") },
          exp: r.int(0, "Results/exp"),
          additive: additive ? { item: additive, count: r.int(1, "AdditiveCount") } : undefined,
        });
      }
    }
  }

  return recipes;
}
