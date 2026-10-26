/**
 * Mounting damaged or unusual data folders, and telling Classic World from the current client.
 */
import { describe, expect, it } from "vitest";

import { detectEdition } from "../src/model/edition.ts";
import { WzFileSystem, type DataFile } from "../src/fs.ts";
import { MemorySource } from "../src/source.ts";

function file(path: string, bytes: Uint8Array | string): DataFile {
  const data = typeof bytes === "string" ? new TextEncoder().encode(bytes) : bytes;

  return { path, source: new MemorySource(path, data) };
}

describe("WzFileSystem.open with bad files", () => {
  it("skips archives and packs it can't open, and reports them", async () => {
    const fs = await WzFileSystem.open([
      file("Npc/Npc_000.wz", new Uint8Array(4096)),
      file("Packs/Mob_00000.ms", new Uint8Array(4096)),
    ]);

    expect(fs.unsupported).toEqual(["Npc/Npc_000.wz", "Packs/Mob_00000.ms"]);
    expect(fs.warnings.some((w) => w.startsWith("Npc/Npc_000.wz: magic is"))).toBe(true);
    expect(fs.warnings.filter((w) => w.startsWith("Npc/Npc_000.wz")).every((w) => !w.startsWith("Npc/Npc_000.wz: Npc/Npc_000.wz"))).toBe(true);
  });

  it("checks Packs.ini entries against the packs present", async () => {
    const fs = await WzFileSystem.open([
      file("Packs/Packs.ini", "Mob|1\r\nSkill|0\r\n"),
      file("Packs/Mob_00000.ms", new Uint8Array(4096)),
      file("Packs/Skill_00000.ms", new Uint8Array(4096)),
    ]);

    expect(fs.warnings).toContain("Packs/Packs.ini: Mob 1 but 1 part file(s) present");
    expect(fs.warnings.some((w) => w.startsWith("Packs/Packs.ini: Skill"))).toBe(false);
    expect(fs.warnings.some((w) => w.includes("no LastWzIndex entry"))).toBe(false);
  });
});

describe("detectEdition", () => {
  const withSkills = (...names: string[]) =>
    ({ imagesUnder: () => names.map((n) => ({ path: `Skill/${n}` })) }) as unknown as WzFileSystem;

  it("treats first and second job books only as Classic World", () => {
    expect(detectEdition(withSkills("000.img", "100.img", "110.img", "800.img", "9200.img", "800127.img"))).toBe("classic");
  });

  it("treats third and fourth job books as the current client", () => {
    expect(detectEdition(withSkills("100.img", "110.img", "111.img", "112.img"))).toBe("current");
  });
});
