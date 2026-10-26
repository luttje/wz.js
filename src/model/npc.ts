/**
 * NPCs: `Npc/<id>.img`, names and speech in `String/Npc.img`. See docs/data-model/npc.md.
 *
 * What an NPC says in its balloon now and then is `info/speak`: keys of its String/Npc.img
 * lines (`n0`, `n1`…), and `condition<N>` sets (`c10`, `c11`…) for residents of
 * `citizenshipTown` at `citizenshipGrade`.
 */
import type { WzFileSystem } from "../fs.ts";
import { readAnimations, resolveFrameSizes, type Animation, type ReadOptions } from "./animation.ts";
import { imageName, parseId } from "./ids.ts";
import { scalars, type Scalar } from "./item.ts";
import { loadStrings } from "./strings.ts";

/** Lines an NPC says in its balloon, still holding `/name`, `/grade` and `/town`. */
export interface NpcSpeech {
  /** Said to everyone. */
  lines: string[];
  /** Said to residents of a citizenship town at a grade. */
  citizens: { town: number; grade: number; lines: string[] }[];
}

export interface Npc {
  id: number;
  name: string;
  func?: string;
  /** Speech and dialogue lines from String/Npc.img (n0, s0, d0, …), by field name. */
  lines: Record<string, string>;
  path: string;
  info: Record<string, Scalar>;
  /** Script names from `info/script/<n>/script`. */
  scripts: string[];
  speech: NpcSpeech;
  link: number | null;
  spritePath: string;
  animations: Animation[];
}

export async function readNpc(fs: WzFileSystem, id: number, options: ReadOptions = {}): Promise<Npc | null> {
  const path = `Npc/${imageName(id, "npc")}`;
  const root = await fs.get(path);

  if (!root) {
    return null;
  }

  const text = (await loadStrings(fs)).npcs.get(id);
  const info = scalars(root.get("info"));
  const link = parseId(info.link);

  let spriteRoot = root;

  if (link !== null) {
    spriteRoot = (await fs.get(`Npc/${imageName(link, "npc")}`)) ?? root;
  }

  const animations = readAnimations(spriteRoot);

  if (options.frameSizes ?? true) {
    await resolveFrameSizes(fs, animations);
  }

  const scripts = (root.get("info/script")?.children() ?? []).map((s) => s.string("", "script")).filter(Boolean);
  const said = (keys: string[]) => keys.map((k) => text?.lines[k] ?? "").filter(Boolean);
  const speak = root.get("info/speak")?.children() ?? [];
  const speech: NpcSpeech = {
    lines: said(speak.filter((c) => c.kind === "string").map((c) => c.string(""))),
    citizens: speak
      .filter((c) => c.name.startsWith("condition"))
      .map((c) => ({
        town: c.int(0, "citizenshipTown"),
        grade: c.int(0, "citizenshipGrade"),
        lines: said(c.children().filter((k) => /^\d+$/.test(k.name)).map((k) => k.string(""))),
      })),
  };

  return {
    id,
    name: text?.name ?? "",
    func: text?.func,
    lines: text?.lines ?? {},
    path,
    info,
    scripts,
    speech,
    link,
    spritePath: spriteRoot.path,
    animations,
  };
}

export function npcIds(fs: WzFileSystem): number[] {
  return [...fs.imagesUnder("Npc")]
    .filter((i) => /^Npc\/\d+\.img$/.test(i.path))
    .map((i) => Number(i.name.replace(".img", "")));
}
