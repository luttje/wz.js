import { describe, expect, it } from "vitest";

import { afterimageBracket } from "../src/model/afterimage.ts";

describe("afterimage brackets", () => {
  const brackets = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  it("picks one bracket per ten levels", () => {
    expect(afterimageBracket(brackets, 1)).toBe(0);
    expect(afterimageBracket(brackets, 9)).toBe(0);
    expect(afterimageBracket(brackets, 10)).toBe(1);
    expect(afterimageBracket(brackets, 35)).toBe(3);
  });

  it("caps at the set's last bracket", () => {
    expect(afterimageBracket(brackets, 200)).toBe(10);
    expect(afterimageBracket([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], 200)).toBe(16);
  });

  it("falls back to the lowest bracket and handles empty sets", () => {
    expect(afterimageBracket([2, 3], 5)).toBe(2);
    expect(afterimageBracket([], 50)).toBeNull();
  });
});
