/**
 * `npm run inventory`: lists the data folder, mounts every archive, parses every
 * image with format statistics, and writes the report to `out/data-inventory.md`
 * (gitignored).
 */
import { mkdir, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import { FormatStats } from "../../src/image.ts";
import { dataRoot, listFiles, mountData, PROJECT_ROOT } from "./data.ts";
import { formatBytes, table } from "./markdown.ts";

const REPORT = join(PROJECT_ROOT, "out", "data-inventory.md");

export async function runInventory(): Promise<void> {
  const root = dataRoot();
  const files = await listFiles(root);

  console.log(`data root: ${root}`);
  console.log(`${files.length} files`);

  // ---- files per top-level tree ----

  const perTree = new Map<string, { files: number; bytes: number; archives: number }>();
  let totalBytes = 0;

  for (const f of files) {
    const size = (await stat(join(root, f))).size;
    const tree = f.split("/")[0];
    const row = perTree.get(tree) ?? { files: 0, bytes: 0, archives: 0 };

    row.files++;
    row.bytes += size;

    if (/_\d+\.wz$/i.test(f)) {
      row.archives++;
    }

    perTree.set(tree, row);
    totalBytes += size;
  }

  // ---- mount and parse everything ----

  const stats = new FormatStats();
  const mountStart = performance.now();
  const data = await mountData({ stats, maxLoadedImages: 64 });
  const mountMs = performance.now() - mountStart;
  const { fs } = data;

  let imageCount = 0;
  let nodeCount = 0;
  const failures: string[] = [];
  const parseStart = performance.now();

  for (const tree of fs.trees()) {
    for (const image of fs.imagesUnder(tree)) {
      try {
        const node = await image.load();

        nodeCount += countNodes(node);
        imageCount++;
      } catch (error) {
        failures.push(`${image.path}: ${(error as Error).message}`);
      }

      image.unload();
    }
  }

  const parseMs = performance.now() - parseStart;

  await data.close();

  console.log(`version ${fs.version}; ${fs.archives.length} archives mounted in ${mountMs.toFixed(0)} ms`);
  console.log(`${imageCount} images, ${nodeCount} nodes parsed in ${(parseMs / 1000).toFixed(1)} s; ${failures.length} failures`);

  for (const f of failures.slice(0, 50)) {
    console.log(`  FAIL ${f}`);
  }

  for (const w of fs.warnings) {
    console.log(`  warn ${w}`);
  }

  // ---- report ----

  const summary = [
    `- Data root used: \`${root}\``,
    `- Detected version: **${fs.version}**`,
    `- Files: ${files.length} (${formatBytes(totalBytes)})`,
    `- PKG1 archives mounted: ${fs.archives.length}, of which ${fs.archives.filter((a) => a.images > 0).length} contain images`,
    `- Images: ${imageCount}; property nodes: ${nodeCount.toLocaleString("en")}; parse failures: ${failures.length}`,
    `- Unsupported files: ${fs.unsupported.length ? fs.unsupported.map((u) => `\`${u}\``).join(", ") : "none"}`,
    `- Mount warnings: ${fs.warnings.length ? "" : "none"}`,
    ...fs.warnings.map((w) => `  - ${w}`),
  ].join("\n");

  const treeRows = [...perTree.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([tree, r]) => [tree, r.files, r.archives, formatBytes(r.bytes)]);

  const archiveRows = fs.archives
    .filter((a) => a.images > 0)
    .map((a) => [`\`${a.path}\``, formatBytes(a.size), a.images, a.version ?? "—"]);

  const perf = [
    `- Mounting all ${fs.archives.length} archives (headers + directories): ${mountMs.toFixed(0)} ms`,
    `- Parsing all ${imageCount} images (metadata only, payloads skipped): ${(parseMs / 1000).toFixed(1)} s`,
    `- Measured in Node ${process.version}.`,
  ].join("\n");

  const report = [
    "# Data inventory",
    "",
    `Generated ${new Date().toISOString()} by \`npm run inventory\`.`,
    "",
    "## Summary",
    "",
    summary,
    "",
    "## Files per folder",
    "",
    table(["Folder", "Files", "Part archives", "Size"], treeRows),
    "",
    "## Archives with images",
    "",
    table(["Archive", "Size", "Images", "Version"], archiveRows),
    "",
    "## Observed formats",
    "",
    renderStats(stats),
    "",
    "## Performance",
    "",
    perf,
    "",
  ].join("\n");

  await mkdir(dirname(REPORT), { recursive: true });
  await writeFile(REPORT, report);

  console.log("wrote out/data-inventory.md");
}

function countNodes(node: { children(): readonly unknown[] }): number {
  let n = 1;

  for (const c of node.children()) {
    n += countNodes(c as typeof node);
  }

  return n;
}

function renderStats(stats: FormatStats): string {
  const sorted = <K>(m: Map<K, number>) => [...m.entries()].sort((a, b) => b[1] - a[1]);
  const hex = (n: number) => `0x${n.toString(16).toUpperCase().padStart(2, "0")}`;

  return [
    "#### Property type bytes seen",
    "",
    table(["Type", "Count"], sorted(stats.propertyTypes).map(([k, v]) => [hex(k), v])),
    "",
    "#### Extended object types seen",
    "",
    table(["Name", "Count"], sorted(stats.extendedTypes).map(([k, v]) => [`\`${k}\``, v])),
    "",
    "#### String block markers seen",
    "",
    table(["Marker", "Count"], sorted(stats.stringMarkers).map(([k, v]) => [hex(k), v])),
    "",
    "#### Canvas format / scale pairs seen",
    "",
    table(["format/scale", "Count"], sorted(stats.canvasFormats).map(([k, v]) => [k, v])),
    "",
    "#### Sound header lengths seen",
    "",
    table(["Header bytes", "Count"], sorted(stats.soundHeaderSizes).map(([k, v]) => [k, v])),
    "",
    "#### Parser notes (unexpected values)",
    "",
    stats.notes.size ? table(["Note", "Count"], sorted(stats.notes).map(([k, v]) => [k, v])) : "None.",
  ].join("\n");
}
