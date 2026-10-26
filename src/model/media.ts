/**
 * Browsing the media trees: every sound in a `Sound/*.img`, and every animation or loose
 * canvas in an `Effect/*.img` or `UI/*.img`.
 */
import type { WzFileSystem } from "../fs.ts";
import type { SoundData, WzNode } from "../node.ts";

export interface MediaImage {
  path: string;
  name: string;
  /** Serialized size in bytes. */
  size: number;
}

export interface SoundEntry {
  path: string;
  /** Path inside the image. */
  name: string;
  durationMs: number;
}

export interface VisualEntry {
  path: string;
  name: string;
  kind: "animation" | "canvas";
  frames: number;
  /** Canvas to show as a thumbnail (the first frame). */
  thumb: string;
}

/** Entries beyond this are cut off (UI images can hold thousands of canvases). */
export const MAX_ENTRIES = 3000;

export function mediaImages(fs: WzFileSystem, root: string): MediaImage[] {
  return [...fs.imagesUnder(root)]
    .filter((i) => !i.path.includes("/_Canvas/") && i.entry.size > 32)
    .map((i) => ({ path: i.path, name: i.path.slice(root.length + 1), size: i.entry.size }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function relative(node: WzNode, image: WzNode): string {
  return node.path.slice(image.path.length + 1);
}

export function soundsIn(image: WzNode): SoundEntry[] {
  const out: SoundEntry[] = [];

  const walk = (node: WzNode) => {
    for (const child of node.children()) {
      if (out.length >= MAX_ENTRIES) {
        return;
      }

      if (child.kind === "sound") {
        out.push({ path: child.path, name: relative(child, image), durationMs: (child.value as SoundData).durationMs });
      } else if (child.kind === "property") {
        walk(child);
      }
    }
  };

  walk(image);

  return out;
}

function isFrame(node: WzNode): boolean {
  const target = node.kind === "uol" ? node.resolve() : node;

  return target?.kind === "canvas";
}

/**
 * Animations are properties whose numbered children are canvases (or links to them); other
 * canvases are listed on their own. Canvases inside an animation aren't listed again.
 */
export function visualsIn(image: WzNode): VisualEntry[] {
  const out: VisualEntry[] = [];

  const visit = (node: WzNode) => {
    if (out.length >= MAX_ENTRIES) {
      return;
    }

    if (node.kind === "canvas") {
      out.push({ path: node.path, name: relative(node, image), kind: "canvas", frames: 1, thumb: node.path });

      return;
    }

    if (node.kind !== "property") {
      return;
    }

    const frames = node
      .children()
      .filter((c) => /^\d+$/.test(c.name) && isFrame(c))
      .sort((a, b) => Number(a.name) - Number(b.name));

    if (frames.length > 1) {
      const thumb = frames[0].resolve()?.path ?? frames[0].path;

      out.push({ path: node.path, name: relative(node, image), kind: "animation", frames: frames.length, thumb });

      // Named children of an animation may hold more (sub-animations, options are skipped).
      for (const sub of node.children()) {
        if (!/^\d+$/.test(sub.name)) {
          visit(sub);
        }
      }

      return;
    }

    for (const child of node.children()) {
      visit(child);
    }
  };

  for (const child of image.children()) {
    visit(child);
  }

  return out;
}
