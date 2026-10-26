import { describe, expect, it } from "vitest";

import { DEFAULT_LOOK, equipType, slotCodes, wear } from "../src/model/avatar.ts";

describe("avatar helpers", () => {
  it("splits slot strings into two-letter codes", () => {
    expect(slotCodes("CpH1H5")).toEqual(["Cp", "H1", "H5"]);
    expect(slotCodes("MaGw")).toEqual(["Ma", "Gw"]);
    expect(slotCodes("")).toEqual([]);
  });

  it("folds weapon types together", () => {
    expect(equipType(1302000)).toBe(130);
    expect(equipType(1402002)).toBe(130);
    expect(equipType(1702001)).toBe(130);
    expect(equipType(1002000)).toBe(100);
  });

  it("replaces the item of the same type", () => {
    const look = wear(DEFAULT_LOOK, 1402002);

    expect(look.equips).toContain(1402002);
    expect(look.equips).not.toContain(1302000);
  });

  it("swaps an overall for top and bottom, and back", () => {
    const overall = wear(DEFAULT_LOOK, 1050000);

    expect(overall.equips).not.toContain(1040002);
    expect(overall.equips).not.toContain(1060002);

    const top = wear(overall, 1040002);

    expect(top.equips).toContain(1040002);
    expect(top.equips).not.toContain(1050000);
  });

  it("puts faces and hairs in their own fields", () => {
    expect(wear(DEFAULT_LOOK, 20001).face).toBe(20001);
    expect(wear(DEFAULT_LOOK, 30000).hair).toBe(30000);
    expect(wear(DEFAULT_LOOK, 41000).hair).toBe(41000);
  });
});
