/**
 * WZ command-line tool (read-only). Every command takes the `Data` folder as `--data <dir>`
 * or from `WZ_DATA`.
 *
 *   npm run wz -- inventory              (also `npm run inventory`)
 *   npm run wz -- tree <path> [depth]
 *   npm run wz -- png <canvasPath> <out.png>
 *   npm run wz -- dump <path> <outDir>
 *   npm run wz -- json <imgPath> <out.json>
 *   npm run wz -- find <text> [folder]   (default String)
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { WzDirectory, WzImage, type WzFileSystem } from "../src/fs.ts";
import type { CanvasData, SoundData, Vector, WzNode } from "../src/node.ts";
import { args as cliArgs, mountData } from "./lib/data.ts";
import { runInventory } from "./lib/inventory.ts";
import { exportCanvasPng } from "./lib/png-export.ts";

const [command, ...args] = cliArgs;

// Exit quietly when output is piped into something like `head` that closes early.
process.stdout.on("error", (error: NodeJS.ErrnoException) => {
  if (error.code === "EPIPE") {
    process.exit(0);
  }

  throw error;
});

const commands: Record<string, (fs: WzFileSystem, args: string[]) => Promise<void>> = {
  tree: treeCommand,
  png: pngCommand,
  dump: dumpCommand,
  json: jsonCommand,
  find: findCommand,
};

async function main(): Promise<void> {
  if (command === "inventory") {
    await runInventory();

    return;
  }

  const run = commands[command];

  if (!run) {
    console.error("usage: npm run wz -- [--data <dir>] inventory | tree <path> [depth] | png <canvasPath> <out.png> | dump <path> <outDir> | json <imgPath> <out.json> | find <text> [folder]");
    process.exit(1);
  }

  const data = await mountData();

  try {
    await run(data.fs, args);
  } finally {
    await data.close();
  }
}

// ---- tree ----------------------------------------------------------------------------

async function treeCommand(fs: WzFileSystem, [path = "", depthArg = "1"]: string[]): Promise<void> {
  const depth = Number(depthArg);
  const entry = fs.entry(path);

  if (entry instanceof WzDirectory) {
    printDirectory(entry, depth, "");

    return;
  }

  const node = await fs.get(path);

  if (!node) {
    throw new Error(`not found: ${path}`);
  }

  console.log(`${node.path}  ${describe(node)}`);
  printNode(node, depth, "  ");
}

function printDirectory(dir: WzDirectory, depth: number, indent: string): void {
  for (const e of dir.entries()) {
    if (e instanceof WzImage) {
      console.log(`${indent}${e.name}  [img ${e.entry.size} B @ ${e.entry.archive.name}:${e.entry.offset}]`);

      continue;
    }

    console.log(`${indent}${e.name}/  [dir: ${e.dirs.size} dirs, ${e.images.size} imgs]`);

    if (depth > 1) {
      printDirectory(e, depth - 1, indent + "  ");
    }
  }
}

function printNode(node: WzNode, depth: number, indent: string): void {
  if (depth <= 0) {
    return;
  }

  for (const child of node.children()) {
    console.log(`${indent}${child.name}  ${describe(child)}`);

    if (child.childCount > 0) {
      printNode(child, depth - 1, indent + "  ");
    }
  }
}

function describe(node: WzNode): string {
  const kind = `[${node.kind} ${node.rawType}]`;

  switch (node.kind) {
    case "property":
    case "convex":
      return `${kind} (${node.childCount})`;

    case "vector": {
      const v = node.value as Vector;

      return `${kind} (${v.x}, ${v.y})`;
    }

    case "canvas": {
      const c = node.value as CanvasData;

      return `${kind} ${c.width}x${c.height} fmt=${c.format} scale=${c.scale} data=${c.dataLength}B (${node.childCount} props)`;
    }

    case "sound": {
      const s = node.value as SoundData;

      return `${kind} ${s.durationMs}ms data=${s.dataLength}B header=${s.header.length}B`;
    }

    case "uol":
      return `${kind} -> ${node.raw()}`;

    case "string": {
      const text = node.value as string;

      return `${kind} ${JSON.stringify(text.length > 120 ? text.slice(0, 120) + "…" : text)}`;
    }

    default:
      return `${kind} ${node.value}`;
  }
}

// ---- png -----------------------------------------------------------------------------

async function pngCommand(fs: WzFileSystem, [path, out]: string[]): Promise<void> {
  if (!path || !out) {
    throw new Error("usage: png <canvasPath> <out.png>");
  }

  const node = await fs.get(path);

  if (!node) {
    throw new Error(`not found: ${path}`);
  }

  const info = await exportCanvasPng(fs, node, resolve(out));

  console.log(`wrote ${out}: ${info}`);
}

// ---- dump ----------------------------------------------------------------------------

/** Exports every canvas under `path` as `<outDir>/<relative path>.png`, listing size and origin. */
async function dumpCommand(fs: WzFileSystem, [path, out]: string[]): Promise<void> {
  if (!path || !out) {
    throw new Error("usage: dump <path> <outDir>");
  }

  const root = await fs.get(path);

  if (!root) {
    throw new Error(`not found: ${path}`);
  }

  const stack: WzNode[] = [root];

  while (stack.length > 0) {
    const node = stack.pop()!;

    if (node.kind === "canvas") {
      const rel = node.path.slice(root.path.length).replace(/^\//, "") || node.name;
      const origin = node.child("origin")?.value as Vector | undefined;

      try {
        const info = await exportCanvasPng(fs, node, resolve(out, `${rel.replace(/:/g, "_")}.png`));

        console.log(`${rel}  ${info.split(" ")[0]}${origin ? `  origin=(${origin.x},${origin.y})` : ""}`);
      } catch (error) {
        console.log(`${rel}  FAILED ${(error as Error).message}`);
      }
    }

    stack.push(...[...node.children()].reverse());
  }
}

// ---- json ----------------------------------------------------------------------------

async function jsonCommand(fs: WzFileSystem, [path, out]: string[]): Promise<void> {
  if (!path || !out) {
    throw new Error("usage: json <imgPath> <out.json>");
  }

  const node = await fs.get(path);

  if (!node) {
    throw new Error(`not found: ${path}`);
  }

  await mkdir(dirname(resolve(out)), { recursive: true });
  await writeFile(out, JSON.stringify(toJson(node), null, 2));
  console.log(`wrote ${out}`);
}

/** Values only: canvases and sounds become short descriptors, never payload bytes. */
export function toJson(node: WzNode): unknown {
  switch (node.kind) {
    case "property":
    case "convex": {
      const out: Record<string, unknown> = {};

      for (const child of node.children()) {
        out[child.name] = toJson(child);
      }

      return out;
    }

    case "canvas": {
      const c = node.value as CanvasData;
      const out: Record<string, unknown> = { $canvas: `${c.width}x${c.height} format ${c.format}` };

      for (const child of node.children()) {
        out[child.name] = toJson(child);
      }

      return out;
    }

    case "sound": {
      const s = node.value as SoundData;

      return { $sound: `${s.durationMs} ms, ${s.dataLength} bytes` };
    }

    case "uol":
      return { $uol: node.raw() };

    default:
      return node.value;
  }
}

// ---- find ----------------------------------------------------------------------------

/** Searches the String tree's names for `text` (case-insensitive). */
async function findCommand(fs: WzFileSystem, [text, under = "String"]: string[]): Promise<void> {
  if (!text) {
    throw new Error("usage: find <text> [folder]");
  }

  const needle = text.toLowerCase();
  let hits = 0;

  for (const image of fs.imagesUnder(under)) {
    const root = await image.load();
    const stack: WzNode[] = [root];

    while (stack.length > 0) {
      const node = stack.pop()!;

      if (node.kind === "string" && (node.value as string).toLowerCase().includes(needle)) {
        console.log(`${node.path}  ${JSON.stringify(node.value)}`);
        hits++;
      }

      stack.push(...node.children());
    }
  }

  console.log(`${hits} match(es)`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? (error.stack ?? error.message) : error);
  process.exit(1);
});
