import { describe, expect, it } from "vitest";

import type { ImageEntry, WzArchive } from "../src/archive.ts";
import { FormatStats, parseImage } from "../src/image.ts";
import type { CanvasData } from "../src/node.ts";
import { MemorySource } from "../src/source.ts";
import { writeImage, type TestProps } from "./helpers/wz-writer.ts";

/** Parses a synthetic image placed at `offset` inside a padded buffer. */
async function parse(props: TestProps, offset = 1000) {
  const image = writeImage(props);
  const file = new Uint8Array(offset + image.length);

  file.set(image, offset);

  const source = new MemorySource("test.wz", file);
  const archive = { source, name: "test.wz" } as unknown as WzArchive;
  const entry: ImageEntry = { kind: "img", name: "1.img", archive, size: image.length, checksum: 0, offset };
  const stats = new FormatStats();
  const root = await parseImage(entry, { path: "Test/1.img" }, stats);

  return { root, stats };
}

describe("parseImage", () => {
  it("reads scalar properties and both string block kinds", async () => {
    const { root } = await parse([
      ["int", { int: 100100 }],
      ["short", { short: -3 }],
      ["long", { long: 1234567890123n }],
      ["float", { float: 0.5 }],
      ["inline", { string: "Snail" }],
      ["offset", { string: "Blue Snail", byOffset: true }],
    ]);

    expect(root.int(0, "int")).toBe(100100);
    expect(root.int(0, "short")).toBe(-3);
    expect(root.int(0, "long")).toBe(1234567890123);
    expect(root.float(0, "float")).toBeCloseTo(0.5);
    expect(root.string("", "inline")).toBe("Snail");
    expect(root.string("", "offset")).toBe("Blue Snail");
  });

  it("parses numeric strings with the typed getters", async () => {
    const { root } = await parse([["delay", { string: "1500" }]]);

    expect(root.int(0, "delay")).toBe(1500);
    expect(root.int(7, "missing")).toBe(7);
  });

  it("reads nested properties, vectors and convex shapes", async () => {
    const { root } = await parse([
      ["info", { props: [["origin", { vector: [27, -55] }]] }],
      ["shape", { convex: [[1, 2], [3, 4]] }],
    ]);

    expect(root.vector("info/origin")).toEqual({ x: 27, y: -55 });
    expect(root.get("shape")?.children().map((c) => c.vector())).toEqual([{ x: 1, y: 2 }, { x: 3, y: 4 }]);
    expect(root.get("info/origin")?.path).toBe("Test/1.img/info/origin");
  });

  it("records canvas metadata and properties without reading pixels", async () => {
    const payload = Uint8Array.of(0x78, 0x9c, 1, 2, 3);
    const { root } = await parse([
      ["stand", { props: [["0", { canvas: { width: 56, height: 55, format: 1, payload, props: [["delay", { int: 150 }]] } }]] }],
    ]);

    const node = root.get("stand/0")!;
    const canvas = node.canvas() as CanvasData;

    expect(node.kind).toBe("canvas");
    expect(canvas.width).toBe(56);
    expect(canvas.height).toBe(55);
    expect(canvas.format).toBe(1);
    expect(canvas.dataLength).toBe(payload.length);
    expect(node.int(0, "delay")).toBe(150);
    expect(node.get("delay")?.path).toBe("Test/1.img/stand/0/delay");
  });

  it("resolves UOLs relative to their parent, including ..", async () => {
    const { root } = await parse([
      ["stand", { props: [["0", { int: 42 }], ["1", { uol: "0" }]] }],
      ["move", { props: [["0", { uol: "../stand/0" }]] }],
      ["loop", { props: [["a", { uol: "b" }], ["b", { uol: "a" }]] }],
    ]);

    expect(root.int(0, "stand/1")).toBe(42);
    expect(root.int(0, "move/0")).toBe(42);
    expect(root.get("move/0")?.path).toBe("Test/1.img/stand/0");
    expect(root.get("stand")?.child("1")?.raw()).toBe("0");
    expect(root.get("loop/a")).toBeUndefined();
  });

  it("looks children up by name in large lists", async () => {
    const props: TestProps = Array.from({ length: 50 }, (_, i) => [String(i), { int: i * 2 }]);
    const { root } = await parse(props);

    expect(root.int(-1, "37")).toBe(74);
  });

  it("counts what it sees", async () => {
    const { stats } = await parse([["a", { int: 1 }], ["b", { vector: [0, 0] }]]);

    expect(stats.propertyTypes.get(0x03)).toBe(1);
    expect(stats.extendedTypes.get("Shape2D#Vector2D")).toBe(1);
  });

  it("rounds longs beyond 2^53 instead of failing (current-client sentinels)", async () => {
    const { root, stats } = await parse([["limit", { long: 999_999_999_999_999_999n }]]);

    expect(root.get("limit")?.value).toBe(1e18);
    expect(stats.notes.get("long value beyond 2^53 (rounded)")).toBe(1);
  });

  it("decodes UTF-16 names and reuses strings referenced by offset", async () => {
    const { root } = await parse([
      ["a", { string: "달팽이" }],
      ["b", { props: [["name", { string: "shared", byOffset: true }]] }],
      ["c", { props: [["name", { string: "shared", byOffset: true }]] }],
    ]);

    expect(root.string("", "a")).toBe("달팽이");
    expect(root.string("", "b/name")).toBe("shared");
    expect(root.string("", "c/name")).toBe("shared");
  });

  it("parses a large image with metadata in every block using few reads", async () => {
    // 400 canvases of ~60 KB: about 24 MB, so nearly every 64 KB block holds metadata.
    const payload = new Uint8Array(60_000);
    const props: TestProps = Array.from({ length: 400 }, (_, i) => [String(i), { canvas: { width: 1, height: 1, format: 2, payload } }]);
    const image = writeImage(props);
    let reads = 0;

    const inner = new MemorySource("big.wz", image);
    const source = {
      name: inner.name,
      size: inner.size,
      readRange(offset: number, length: number) {
        reads++;

        return inner.readRange(offset, length);
      },
    };

    const archive = { source, name: "big.wz" } as unknown as WzArchive;
    const entry: ImageEntry = { kind: "img", name: "big.img", archive, size: image.length, checksum: 0, offset: 0 };
    const root = await parseImage(entry, { path: "Test/big.img" });

    expect(root.childCount).toBe(400);
    expect((root.get("399")?.canvas() as CanvasData).dataLength).toBe(payload.length);
    expect(reads).toBeLessThan(40);
  });
});
