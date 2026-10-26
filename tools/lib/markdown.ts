/**
 * Writes generated sections into hand-written docs without touching the rest.
 *
 * A generated section sits between `<!-- generated:<id> -->` and `<!-- /generated:<id> -->`.
 * If the markers are missing, the section is appended at the end of the file.
 */
import { existsSync, readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

export async function writeGeneratedSection(path: string, id: string, content: string, title?: string): Promise<void> {
  const open = `<!-- generated:${id} -->`;
  const close = `<!-- /generated:${id} -->`;
  const block = `${open}\n${content.trim()}\n${close}`;

  let text = existsSync(path) ? readFileSync(path, "utf8") : `# ${title ?? id}\n`;

  const start = text.indexOf(open);
  const end = text.indexOf(close);

  if (start >= 0 && end > start) {
    text = text.slice(0, start) + block + text.slice(end + close.length);
  } else {
    text = `${text.trimEnd()}\n\n${block}\n`;
  }

  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, text);
}

/** Formats rows as a Markdown table. */
export function table(headers: string[], rows: (string | number)[][]): string {
  const head = `| ${headers.join(" | ")} |`;
  const rule = `|${headers.map(() => "---").join("|")}|`;
  const body = rows.map((r) => `| ${r.join(" | ")} |`);

  return [head, rule, ...body].join("\n");
}

export function formatBytes(n: number): string {
  if (n < 1024) {
    return `${n} B`;
  }

  if (n < 1024 * 1024) {
    return `${(n / 1024).toFixed(1)} KB`;
  }

  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}
