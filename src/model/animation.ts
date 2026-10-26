/**
 * Animation frames: a node whose numbered children are canvases (or UOLs to canvases).
 * See docs/rendering.md ("Animation timing").
 */
import type { WzFileSystem } from "../fs.ts";
import type { Vector, WzNode } from "../node.ts";

export interface Frame {
  /** Path of the canvas node (after UOL resolution); links are resolved when decoding. */
  canvas: string;
  width: number;
  height: number;
  origin: Vector;
  /** Milliseconds; missing delays default to 100. */
  delay: number;
  /** Layer order inside composites (numeric z, or a z-layer name for character parts). */
  z: number | string | null;
  /** Alpha at the start and end of the frame (0–255), when the frame fades. */
  a0: number | null;
  a1: number | null;
  /** Named vectors on the frame (lt, rb, head, muzzle, …). */
  vectors: Record<string, Vector>;
  /** The UOL text when the frame was reached through a link. */
  via: string | null;
}

export interface Animation {
  name: string;
  /** Path of the animation node. */
  path: string;
  frames: Frame[];
  /** True when the node says to play forward then backward (`zigzag`). */
  zigzag: boolean;
  /** True when the animation should loop (most do; `repeat = 0` is rare). */
  loop: boolean;
}

export const DEFAULT_DELAY = 100;

/** Reads the numbered frames of an animation node. Non-canvas children are ignored. */
export function readAnimation(node: WzNode): Animation {
  const frames: Frame[] = [];

  const numbered = node
    .children()
    .filter((c) => /^\d+$/.test(c.name))
    .sort((a, b) => Number(a.name) - Number(b.name));

  for (const child of numbered) {
    const frame = readFrame(child);

    if (frame) {
      frames.push(frame);
    }
  }

  return {
    name: node.name,
    path: node.path,
    frames,
    zigzag: node.int(0, "zigzag") === 1,
    loop: node.child("repeat") ? node.int(1, "repeat") !== 0 : true,
  };
}

/** Reads one frame; follows a UOL and records it. */
export function readFrame(node: WzNode): Frame | null {
  const target = node.resolve();

  if (!target || target.kind !== "canvas") {
    return null;
  }

  const canvas = target.canvas()!;
  const vectors: Record<string, Vector> = {};

  for (const child of target.children()) {
    if (child.kind === "vector" && child.name !== "origin") {
      vectors[child.name] = child.value as Vector;
    }
  }

  const zNode = target.child("z");
  const z = zNode ? (zNode.kind === "string" ? (zNode.value as string) : target.int(0, "z")) : null;

  return {
    canvas: target.path,
    width: canvas.width,
    height: canvas.height,
    origin: target.vector("origin") ?? { x: 0, y: 0 },
    delay: target.child("delay") ? target.int(DEFAULT_DELAY, "delay") : DEFAULT_DELAY,
    z,
    a0: target.child("a0") ? target.int(255, "a0") : null,
    a1: target.child("a1") ? target.int(255, "a1") : null,
    vectors,
    via: node.kind === "uol" ? node.raw() ?? null : null,
  };
}

/** Options shared by the entity readers. */
export interface ReadOptions {
  /**
   * Look up the real size of 1x1 placeholder frames in the `_Canvas` archives (default
   * true). That parses the large pixel images, so callers that only need icon paths skip it.
   */
  frameSizes?: boolean;
}

/**
 * Replaces placeholder frame sizes with the real ones. Frames whose pixels live elsewhere
 * (`_outlink` / `_inlink`) are 1x1 placeholders; their true width and height come from the
 * link target. Origins and delays stay as read (they belong to the placeholder).
 */
export async function resolveFrameSizes(fs: WzFileSystem, animations: Animation[]): Promise<void> {
  const jobs: Promise<void>[] = [];

  for (const anim of animations) {
    for (const frame of anim.frames) {
      if (frame.width > 1 || frame.height > 1) {
        continue;
      }

      jobs.push(
        (async () => {
          const node = await fs.get(frame.canvas);
          const resolved = node && (await fs.resolveCanvas(node));

          if (resolved) {
            frame.width = resolved.canvas.width;
            frame.height = resolved.canvas.height;
          }
        })(),
      );
    }
  }

  await Promise.all(jobs);
}

/** Every child of `node` that is an animation (has at least one numbered canvas frame). */
export function readAnimations(node: WzNode, skip: string[] = ["info"]): Animation[] {
  const out: Animation[] = [];

  for (const child of node.children()) {
    if (skip.includes(child.name)) {
      continue;
    }

    const resolved = child.resolve();

    if (!resolved || resolved.kind !== "property") {
      continue;
    }

    const anim = readAnimation(resolved);

    if (anim.frames.length > 0) {
      out.push({ ...anim, name: child.name });
    }
  }

  return out;
}
