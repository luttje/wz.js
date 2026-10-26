/**
 * Weapon swing trails: `Character/Afterimage/<name>.img`, the set a weapon names in
 * `info/afterImage` (`barehands` without one). Laid out as `<level bracket>/<action>/<first
 * frame>/<trail frames>` with the action's `lt`/`rb` beside the frame number. See
 * docs/rendering.md ("Swing trails").
 */
import type { WzFileSystem } from "../fs.ts";
import { readAnimation, resolveFrameSizes, type Animation } from "./animation.ts";

export interface Afterimage {
  /** The attack action's frame at which the trail appears. */
  start: number;
  /** Trail frames, drawn at the feet and facing left like the body. */
  animation: Animation;
}

/**
 * The level bracket a character draws: one per 10 levels (UNVERIFIED for this client; other
 * versions use `level / 10`), capped at the last one the set has.
 */
export function afterimageBracket(brackets: number[], level: number): number | null {
  if (brackets.length === 0) {
    return null;
  }

  const wanted = Math.floor(Math.max(0, level) / 10);

  return brackets.filter((b) => b <= wanted).reduce((a, b) => Math.max(a, b), Math.min(...brackets));
}

/** The trail of `action` in afterimage set `name` for a character of `level`, or null. */
export async function readAfterimage(fs: WzFileSystem, name: string, level: number, action: string): Promise<Afterimage | null> {
  const root = await fs.get(`Character/Afterimage/${name}.img`);

  if (!root) {
    return null;
  }

  // `charge` (charged weapons) sits beside the numbered brackets.
  const brackets = root
    .children()
    .filter((c) => /^\d+$/.test(c.name))
    .map((c) => Number(c.name));
  const bracket = afterimageBracket(brackets, level);
  const node = bracket === null ? null : root.child(String(bracket))?.child(action);
  const first = node?.children().find((c) => /^\d+$/.test(c.name));

  if (!first) {
    return null;
  }

  const animation = { ...readAnimation(first), loop: false };

  if (animation.frames.length === 0) {
    return null;
  }

  await resolveFrameSizes(fs, [animation]);

  return { start: Number(first.name), animation };
}
