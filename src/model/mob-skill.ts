/**
 * Monster skills: `Skill/MobSkill/<id>.img` (from the `.ms` pack). Monsters name them in
 * `info/skill/<n>` (`skill`, `level`, `action`), and traps and monster attacks name one as
 * their `disease`. See docs/data-model/mob-skill.md.
 */
import type { WzFileSystem } from "../fs.ts";
import type { Vector, WzNode } from "../node.ts";
import { readAnimation, resolveFrameSizes, type Animation } from "./animation.ts";

/** Where an animation plays (`pos`): at the feet, over the head, or on the body's middle. */
export type MobSkillPos = "feet" | "head" | "body";

export interface MobSkillAnimation extends Animation {
  pos: MobSkillPos;
}

export interface MobSkillLevel {
  /** Seconds the status lasts. */
  time: number;
  /** Chance (%) that it takes on each player in reach. */
  prop: number;
  /** Seconds before the monster can use it again. */
  interval: number;
  /** The skill's value (Poison's HP per second, Darkness' accuracy %, a buff's stat). */
  x: number;
  mpCon: number;
  /** The area it reaches around the monster (drawn facing left), when it has one. */
  lt?: Vector;
  rb?: Vector;
  /** Plays on the monster using it. */
  effect?: MobSkillAnimation;
  /** Plays on the player it takes on, for as long as it lasts. */
  affected?: MobSkillAnimation;
  /** Plays over a monster it buffs, for as long as it lasts. */
  mob?: MobSkillAnimation;
}

export interface MobSkill {
  id: number;
  /** Index 0 = level 1. */
  levels: MobSkillLevel[];
}

/** Statuses monster skills put on players, by mob skill ID. */
export const DISEASES = {
  120: "seal",
  121: "darkness",
  122: "weakness",
  123: "stun",
  124: "curse",
  125: "poison",
  126: "slow",
} as const;

export type DiseaseKind = (typeof DISEASES)[keyof typeof DISEASES];

/** The monster stat a buff raises by its `x`. */
export type MobBuffStat = "pad" | "pdd" | "mad" | "mdd";

/**
 * Monster buffs, by mob skill ID: 160–163 on the monster itself, 164–167 on the monsters in
 * its area. Which stat each raises follows NiaMeowDB's monster pages (Dark Stone Golem: 160
 * physical attack, 161 physical defence; Mano: 165 physical defence, 167 magic defence); 162
 * and 166 (magic attack) are the ones left over (UNVERIFIED).
 */
export const MOB_BUFFS: Record<number, { stat: MobBuffStat; area: boolean }> = {
  160: { stat: "pad", area: false },
  161: { stat: "pdd", area: false },
  162: { stat: "mad", area: false },
  163: { stat: "mdd", area: false },
  164: { stat: "pad", area: true },
  165: { stat: "pdd", area: true },
  166: { stat: "mad", area: true },
  167: { stat: "mdd", area: true },
};

export function diseaseOf(skillId: number): DiseaseKind | undefined {
  return DISEASES[skillId as keyof typeof DISEASES];
}

const POS: Record<number, MobSkillPos> = { 0: "feet", 1: "head", 2: "head", 3: "body" };

export async function readMobSkill(fs: WzFileSystem, id: number): Promise<MobSkill | null> {
  const root = await fs.get(`Skill/MobSkill/${id}.img`);

  if (!root) {
    return null;
  }

  const levels = (root.get("level")?.children() ?? [])
    .filter((c) => /^\d+$/.test(c.name))
    .sort((a, b) => Number(a.name) - Number(b.name))
    .map(readLevel);
  const animations = (l: MobSkillLevel) => [l.effect, l.affected, l.mob].filter((a): a is MobSkillAnimation => a !== undefined);

  await resolveFrameSizes(fs, levels.flatMap(animations));

  return { id, levels };
}

function readLevel(node: WzNode): MobSkillLevel {
  return {
    time: node.int(0, "time"),
    prop: node.int(100, "prop"),
    interval: node.int(0, "interval"),
    x: node.int(0, "x"),
    mpCon: node.int(0, "mpCon"),
    lt: node.vector("lt"),
    rb: node.vector("rb"),
    effect: animationOf(node, "effect"),
    affected: animationOf(node, "affected"),
    mob: animationOf(node, "mob"),
  };
}

function animationOf(node: WzNode, name: string): MobSkillAnimation | undefined {
  const target = node.child(name)?.resolve();

  if (!target) {
    return undefined;
  }

  const anim = readAnimation(target);

  if (anim.frames.length === 0) {
    return undefined;
  }

  return { ...anim, pos: POS[target.int(0, "pos")] ?? "feet" };
}
