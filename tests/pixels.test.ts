import { deflateSync } from "node:zlib";

import { describe, expect, it } from "vitest";

import { convert, decodeCanvas, decompress, UnsupportedFormatError } from "../src/decode/pixels.ts";

describe("decompress", () => {
  it("inflates a complete zlib stream", async () => {
    const data = Uint8Array.from({ length: 1000 }, (_, i) => i % 7);

    expect(await decompress(deflateSync(data))).toEqual(data);
  });

  it("keeps the data of a stream whose checksum is missing", async () => {
    const data = Uint8Array.from({ length: 1000 }, (_, i) => i % 13);
    const truncated = deflateSync(data).subarray(0, -4);

    expect(await decompress(truncated)).toEqual(data);
  });

  it("joins length-prefixed chunks when there is no zlib header", async () => {
    const z = deflateSync(Uint8Array.of(9, 8, 7, 6));
    const split = 3;
    const chunked = new Uint8Array(4 + split + 4 + (z.length - split));
    const view = new DataView(chunked.buffer);

    view.setInt32(0, split, true);
    chunked.set(z.subarray(0, split), 4);
    view.setInt32(4 + split, z.length - split, true);
    chunked.set(z.subarray(split), 8 + split);

    expect(await decompress(chunked)).toEqual(Uint8Array.of(9, 8, 7, 6));
  });
});

describe("pixel formats", () => {
  it("expands BGRA4444 nibbles", () => {
    // Bytes: (G<<4 | B), (A<<4 | R)
    const rgba = convert(Uint8Array.of(0x21, 0xf3), 1, 1, 1);

    expect([...rgba]).toEqual([0x33, 0x22, 0x11, 0xff]);
  });

  it("swaps BGRA8888 to RGBA", () => {
    expect([...convert(Uint8Array.of(1, 2, 3, 4), 1, 1, 2)]).toEqual([3, 2, 1, 4]);
  });

  it("expands RGB565 to full range", () => {
    const white = convert(Uint8Array.of(0xff, 0xff), 1, 1, 513);
    const red = convert(Uint8Array.of(0x00, 0xf8), 1, 1, 513);

    expect([...white]).toEqual([255, 255, 255, 255]);
    expect([...red]).toEqual([255, 0, 0, 255]);
  });

  it("decodes a DXT5 block", () => {
    const block = new Uint8Array(16);

    // Alpha endpoints 255 and 0, all indices 0 -> alpha 255.
    block[0] = 255;
    block[1] = 0;

    // Colour endpoints: c0 = pure red (0xF800), c1 = black; all indices 0 -> red.
    block[8] = 0x00;
    block[9] = 0xf8;

    const rgba = convert(block, 4, 4, 2050);

    expect([...rgba.subarray(0, 4)]).toEqual([255, 0, 0, 255]);
    expect([...rgba.subarray(60, 64)]).toEqual([255, 0, 0, 255]);
  });

  it("throws a typed error for unknown formats", () => {
    expect(() => convert(new Uint8Array(4), 1, 1, 4098)).toThrow(UnsupportedFormatError);
  });

  it("upscales stored pixels by 2^scale", async () => {
    // One stored RGB565 pixel scaled by 16 fills a 16x16 canvas.
    const payload = deflateSync(Uint8Array.of(0x1f, 0x00));
    const image = await decodeCanvas(payload, 16, 16, 513, 4);

    expect(image.rgba.length).toBe(16 * 16 * 4);
    expect([...image.rgba.subarray(-4)]).toEqual([0, 0, 255, 255]);
  });
});
