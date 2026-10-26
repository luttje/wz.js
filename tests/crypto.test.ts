import { describe, expect, it } from "vitest";

import { decodeAscii, decodeUtf16, decryptOffset, encVerOf, OFFSET_CONSTANT, rotl32, versionHash } from "../src/crypto.ts";

/** Reference implementation with BigInt, to check the 32-bit Number arithmetic. */
function referenceDecrypt(pos: number, encrypted: number, fstart: number, hash: number): number {
  const M = 0xffffffffn;
  let o = (BigInt(pos - fstart) ^ M) & M;

  o = (o * BigInt(hash)) & M;
  o = (o - BigInt(OFFSET_CONSTANT)) & M;

  const n = o & 0x1fn;

  o = ((o << n) | (o >> (32n - n))) & M;
  o = (o ^ BigInt(encrypted)) & M;
  o = (o + BigInt(fstart) * 2n) & M;

  return Number(o);
}

describe("rotl32", () => {
  it("returns the input for a zero shift", () => {
    expect(rotl32(0x12345678, 0)).toBe(0x12345678);
  });

  it("wraps the high bit around", () => {
    expect(rotl32(0x80000000, 1)).toBe(1);
    expect(rotl32(0x80000001, 31)).toBe(0xc0000000);
  });

  it("uses only the low five bits of the shift", () => {
    expect(rotl32(0x12345678, 32)).toBe(0x12345678);
    expect(rotl32(0x12345678, 36)).toBe(rotl32(0x12345678, 4));
  });

  it("always returns an unsigned value", () => {
    expect(rotl32(-1, 7)).toBe(0xffffffff);
    expect(rotl32(0x40000000, 1)).toBe(0x80000000);
  });
});

describe("version hash", () => {
  it("matches the value reported for version 779", () => {
    expect(versionHash(779)).toBe(0x0000e73a);
  });

  it("produces encVer 34 for version 779", () => {
    expect(encVerOf(versionHash(779))).toBe(34);
  });

  it("wraps to 32 bits for long version strings", () => {
    const h = versionHash(1999999999);

    expect(h).toBeGreaterThanOrEqual(0);
    expect(h).toBeLessThanOrEqual(0xffffffff);
  });
});

describe("decryptOffset", () => {
  it("matches a BigInt reference across the 32-bit range", () => {
    const hash = versionHash(779);
    let seed = 12345;

    const next = () => {
      seed = (Math.imul(seed, 1103515245) + 12345) >>> 0;

      return seed;
    };

    for (let i = 0; i < 2000; i++) {
      const fstart = 60 + (next() % 1000);
      const pos = fstart + (next() % 100_000_000);
      const encrypted = next();

      expect(decryptOffset(pos, encrypted, fstart, hash)).toBe(referenceDecrypt(pos, encrypted, fstart, hash));
    }
  });

  it("handles products that overflow 2^53 (Math.imul, not *)", () => {
    const hash = 0xffffffff;
    const pos = 0x7fffffff;

    expect(decryptOffset(pos, 0, 60, hash)).toBe(referenceDecrypt(pos, 0, 60, hash));
  });
});

describe("string masks", () => {
  it("unmasks ASCII with (0xAA + k)", () => {
    const text = "Mushroom Town";
    const bytes = Uint8Array.from(text, (c, k) => c.charCodeAt(0) ^ ((0xaa + k) & 0xff));

    expect(decodeAscii(bytes)).toBe(text);
  });

  it("wraps the ASCII mask after 256 characters", () => {
    const text = "x".repeat(300);
    const bytes = Uint8Array.from(text, (c, k) => c.charCodeAt(0) ^ ((0xaa + k) & 0xff));

    expect(decodeAscii(bytes)).toBe(text);
  });

  it("unmasks UTF-16 with (0xAAAA + k)", () => {
    const text = "메이플 ★ Maple";
    const bytes = new Uint8Array(text.length * 2);

    for (let k = 0; k < text.length; k++) {
      const v = text.charCodeAt(k) ^ ((0xaaaa + k) & 0xffff);

      bytes[k * 2] = v & 0xff;
      bytes[k * 2 + 1] = v >> 8;
    }

    expect(decodeUtf16(bytes, text.length)).toBe(text);
  });
});
