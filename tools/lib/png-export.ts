/** Exports one canvas node as a PNG file (tools only). */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import { decodeCanvas } from "../../src/decode/pixels.ts";
import type { WzFileSystem } from "../../src/fs.ts";
import type { WzNode } from "../../src/node.ts";

import { encodePng } from "./png.ts";

/** Returns a one-line description of what was written. */
export async function exportCanvasPng(fs: WzFileSystem, node: WzNode, out: string): Promise<string> {
  const resolved = await fs.resolveCanvas(node);

  if (!resolved) {
    throw new Error(`${node.path} is not a canvas (or its link is broken)`);
  }

  const { canvas, via } = resolved;
  const payload = await fs.readPayload(canvas);
  const image = await decodeCanvas(payload, canvas.width, canvas.height, canvas.format, canvas.scale);

  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, encodePng(image.width, image.height, image.rgba));

  const link = via ? ` via ${via}` : "";

  return `${canvas.width}x${canvas.height} format ${canvas.format}/${canvas.scale}${link}`;
}
