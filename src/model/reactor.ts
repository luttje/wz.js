/**
 * Reactors: `Reactor/<id>.img`. Numbered children are states; each state has idle frames,
 * an optional `hit` animation and `event` entries that move it to another state.
 */
import type { WzFileSystem } from "../fs.ts";
import { readAnimation, resolveFrameSizes, type Animation, type ReadOptions } from "./animation.ts";
import { imageName, parseId } from "./ids.ts";
import { scalars, type Scalar } from "./item.ts";

export interface ReactorEvent {
  type: number;
  /** The state this event leads to. */
  state: number;
  /** Other fields (item IDs to drop in, `lt`/`rb` areas, …), raw. */
  fields: Record<string, Scalar>;
}

export interface ReactorState {
  state: number;
  idle: Animation;
  hit: Animation | null;
  events: ReactorEvent[];
}

export interface Reactor {
  id: number;
  name: string;
  path: string;
  info: Record<string, Scalar>;
  action?: string;
  link: number | null;
  states: ReactorState[];
}

export async function readReactor(fs: WzFileSystem, id: number, options: ReadOptions = {}): Promise<Reactor | null> {
  const path = `Reactor/${imageName(id, "reactor")}`;
  const root = await fs.get(path);

  if (!root) {
    return null;
  }

  const info = scalars(root.get("info"));
  const link = parseId(info.link);
  const spriteRoot = link !== null ? ((await fs.get(`Reactor/${imageName(link, "reactor")}`)) ?? root) : root;

  const states: ReactorState[] = spriteRoot
    .children()
    .filter((c) => /^\d+$/.test(c.name))
    .sort((a, b) => Number(a.name) - Number(b.name))
    .map((stateNode) => {
      const node = stateNode.resolve() ?? stateNode;
      const hitNode = node.get("hit");

      return {
        state: Number(stateNode.name),
        idle: readAnimation(node),
        hit: hitNode ? readAnimation(hitNode) : null,
        events: (node.get("event")?.children() ?? [])
          .filter((e) => /^\d+$/.test(e.name))
          .map((e) => ({ type: e.int(0, "type"), state: e.int(0, "state"), fields: scalars(e) })),
      };
    });

  if (options.frameSizes ?? true) {
    await resolveFrameSizes(
      fs,
      states.flatMap((s) => (s.hit ? [s.idle, s.hit] : [s.idle])),
    );
  }

  return {
    id,
    name: String(info.info ?? info.name ?? ""),
    path,
    info,
    action: root.string("", "action") || undefined,
    link,
    states,
  };
}

export function reactorIds(fs: WzFileSystem): number[] {
  return [...fs.imagesUnder("Reactor")]
    .filter((i) => /^Reactor\/\d+\.img$/.test(i.path))
    .map((i) => Number(i.name.replace(".img", "")));
}
