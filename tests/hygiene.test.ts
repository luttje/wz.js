/** Repository rules: no game data is ever committed. */
import { execSync } from "node:child_process";

import { describe, expect, it } from "vitest";

function trackedFiles(): string[] {
  try {
    return execSync("git ls-files", { encoding: "utf8" }).split("\n").filter(Boolean);
  } catch {
    return [];
  }
}

describe("repository hygiene", () => {
  const files = trackedFiles();

  it("tracks nothing under out/ (the tools' extracted data)", () => {
    expect(files.filter((f) => f.startsWith("out/"))).toEqual([]);
  });

  it("tracks no archives", () => {
    const banned = files.filter((f) => /\.(wz|ms|img)$/i.test(f));

    expect(banned).toEqual([]);
  });
});
