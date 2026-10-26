import { describe, expect, it } from "vitest";

import { BlockCursor, Cursor, MissingBlock, OutOfWindow } from "../src/cursor.ts";
import { BLOCK_SIZE, CachedSource, MemorySource } from "../src/source.ts";
import { ByteWriter } from "./helpers/wz-writer.ts";

describe("cint / clong", () => {
  it("reads a one-byte value", () => {
    const c = new Cursor(Uint8Array.of(0x05, 0xfb));

    expect(c.cint()).toBe(5);
    expect(c.cint()).toBe(-5);
  });

  it("reads the i32 escape after -128", () => {
    const bytes = new ByteWriter().u8(0x80).i32(-100_000).u8(0x80).i32(2_000_000_000).toBytes();
    const c = new Cursor(bytes);

    expect(c.cint()).toBe(-100_000);
    expect(c.cint()).toBe(2_000_000_000);
  });

  it("treats 127 and -127 as plain values", () => {
    const c = new Cursor(Uint8Array.of(0x7f, 0x81));

    expect(c.cint()).toBe(127);
    expect(c.cint()).toBe(-127);
  });

  it("reads the i64 escape for clong", () => {
    const bytes = new ByteWriter().u8(0x80).i64(9_007_199_254_740_991n).toBytes();

    expect(new Cursor(bytes).clong()).toBe(Number.MAX_SAFE_INTEGER);
  });

  it("rejects 64-bit values that aren't safe integers", () => {
    const bytes = new ByteWriter().u8(0x80).i64(9_007_199_254_740_993n).toBytes();

    expect(() => new Cursor(bytes).clong()).toThrow(RangeError);
  });
});

describe("encrypted strings", () => {
  it("round-trips ASCII, UTF-16, empty and long strings", () => {
    const samples = ["", "Henesys", "x".repeat(128), "x".repeat(500), "한글", "가".repeat(200)];
    const w = new ByteWriter();

    for (const s of samples) {
      w.wzString(s);
    }

    const c = new Cursor(w.toBytes());

    for (const s of samples) {
      expect(c.wzString()).toBe(s);
    }
  });
});

describe("Cursor", () => {
  it("uses absolute positions and reports reads past the window", () => {
    const c = new Cursor(Uint8Array.of(1, 2, 3, 4), 100);

    expect(c.pos).toBe(100);
    expect(c.u16()).toBe(0x0201);
    expect(c.pos).toBe(102);
    expect(() => c.u32()).toThrow(OutOfWindow);
  });
});

describe("BlockCursor", () => {
  const bytes = Uint8Array.from({ length: BLOCK_SIZE * 2 }, (_, i) => i & 0xff);

  it("reads values that straddle two blocks", () => {
    const blocks = new Map([
      [0, bytes.subarray(0, BLOCK_SIZE)],
      [1, bytes.subarray(BLOCK_SIZE)],
    ]);
    const c = new BlockCursor(blocks, BLOCK_SIZE - 2);
    const expected = new DataView(bytes.buffer).getUint32(BLOCK_SIZE - 2, true);

    expect(c.u32()).toBe(expected);
  });

  it("names the block it is missing", () => {
    const blocks = new Map([[0, bytes.subarray(0, BLOCK_SIZE)]]);
    const c = new BlockCursor(blocks, BLOCK_SIZE + 10);

    expect(() => c.u8()).toThrow(MissingBlock);

    try {
      new BlockCursor(blocks, BLOCK_SIZE - 1).u16();
    } catch (error) {
      expect((error as MissingBlock).block).toBe(1);
    }
  });
});

describe("CachedSource", () => {
  it("returns the same bytes as the underlying source for any range", async () => {
    const data = Uint8Array.from({ length: BLOCK_SIZE * 3 + 123 }, (_, i) => (i * 7) & 0xff);
    const inner = new MemorySource("mem", data);
    const cached = new CachedSource(inner, 2);

    for (const [offset, length] of [
      [0, 10],
      [BLOCK_SIZE - 5, 10],
      [BLOCK_SIZE * 2 + 100, BLOCK_SIZE + 100],
      [data.length - 3, 10],
      [5, BLOCK_SIZE * 3],
    ]) {
      const got = await cached.readRange(offset, length);
      const want = data.subarray(offset, Math.min(data.length, offset + length));

      expect(got).toEqual(want);
    }
  });
});
