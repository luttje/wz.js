/**
 * Mounting the game data read-only for the tools. The `Data` folder comes from `--data <dir>`
 * or the `WZ_DATA` environment variable; the tools' other arguments are `args`.
 */
import { readdir } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import { parseArgs } from "node:util";

import { WzFileSystem, type DataFile, type MountOptions } from "../../src/fs.ts";
import { NodeFileSource } from "../../src/sources/node.ts";

export const PROJECT_ROOT = resolve(import.meta.dirname, "..", "..");

const parsed = parseArgs({
  allowPositionals: true,
  options: {
    data: { type: "string" },
    out: { type: "string" },
  },
});

/** Positional arguments (the command and its operands). */
export const args = parsed.positionals;

/** `--out <dir>`, when given. */
export const outOption = parsed.values.out;

export interface MountedData {
  fs: WzFileSystem;
  root: string;
  close(): Promise<void>;
}

/** The `Data` folder to read. */
export function dataRoot(): string {
  const dir = parsed.values.data ?? process.env.WZ_DATA;

  if (!dir) {
    throw new Error("no data folder: pass --data <dir> or set WZ_DATA (e.g. …/MapleStory/MSCW/Data)");
  }

  return resolve(dir);
}

/** Lists every file under `dir` as `Data`-relative forward-slash paths. */
export async function listFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { recursive: true, withFileTypes: true });

  return entries
    .filter((e) => e.isFile())
    .map((e) => relative(dir, join(e.parentPath, e.name)).replaceAll("\\", "/"))
    .sort();
}

/** Mounts the data folder read-only. Call `close()` when done. */
export async function mountData(options: MountOptions = {}): Promise<MountedData> {
  const root = dataRoot();
  const sources: NodeFileSource[] = [];
  const files: DataFile[] = [];

  for (const p of await listFiles(root)) {
    if (!/\.(wz|ini|ms)$/i.test(p)) {
      continue;
    }

    const source = await NodeFileSource.open(join(root, p), p);

    sources.push(source);
    files.push({ path: p, source });
  }

  const fs = await WzFileSystem.open(files, options);

  return {
    fs,
    root,
    close: async () => {
      await Promise.all(sources.map((s) => s.close()));
    },
  };
}
