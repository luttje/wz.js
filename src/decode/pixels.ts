/**
 * Canvas pixel decoding: decompression plus conversion of each pixel format to RGBA8.
 * Pure TypeScript using only web-standard APIs, so it runs in workers and in Node.
 * See docs/wz-format.md for the formats observed in the data.
 */

export interface DecodedImage {
  width: number;
  height: number;
  /** RGBA8, `width * height * 4` bytes, not premultiplied. */
  rgba: Uint8Array;
}

export class UnsupportedFormatError extends Error {
  constructor(readonly format: number) {
    super(`unsupported canvas format ${format}`);
  }
}

/**
 * Decodes a canvas payload.
 *
 * @param payload the canvas data bytes (after the leading zero byte)
 * @param width canvas width in pixels
 * @param height canvas height in pixels
 * @param format pixel format id
 * @param scale stored size is `(width >> scale) x (height >> scale)`; pixels are upscaled
 */
export async function decodeCanvas(
  payload: Uint8Array,
  width: number,
  height: number,
  format: number,
  scale: number,
): Promise<DecodedImage> {
  const storedWidth = Math.max(1, width >> scale);
  const storedHeight = Math.max(1, height >> scale);
  const raw = await decompress(payload, storedSize(format, storedWidth, storedHeight));
  const stored = convert(raw, storedWidth, storedHeight, format);

  if (scale === 0) {
    return { width, height, rgba: stored };
  }

  return { width, height, rgba: upscale(stored, storedWidth, storedHeight, width, height, 1 << scale) };
}

/** Multiplies each pixel's colour by its alpha, in place (what GPU textures want). */
export function premultiply(rgba: Uint8Array): void {
  for (let i = 0; i < rgba.length; i += 4) {
    const a = rgba[i + 3];

    if (a === 255) {
      continue;
    }

    rgba[i] = (rgba[i] * a + 127) / 255;
    rgba[i + 1] = (rgba[i + 1] * a + 127) / 255;
    rgba[i + 2] = (rgba[i + 2] * a + 127) / 255;
  }
}

// ---- decompression -------------------------------------------------------------------

/**
 * zlib streams start with 0x78; anything else is a list of `i32 length` + bytes chunks.
 *
 * The client's pixel streams end at a sync-flush point: the deflate data has no final
 * block and the zlib checksum is missing. Appending an empty final block (`03 00`) to the
 * raw deflate data makes it a complete stream that every inflater finishes cleanly. (Relying
 * on an inflater's output before its "unexpected end" error is not enough: browsers withhold
 * the last output, which cut off the bottom of large images.)
 *
 * @param expected the decompressed size the caller needs; a shorter result triggers the
 *   tolerant fallback
 */
export async function decompress(payload: Uint8Array, expected = 0): Promise<Uint8Array> {
  const isZlib = payload.length >= 2 && payload[0] === 0x78 && ((payload[0] << 8) | payload[1]) % 31 === 0;
  const zlib = isZlib ? payload : joinChunks(payload);

  const raw = new Uint8Array(zlib.length);

  raw.set(zlib.subarray(2));
  raw.set(EMPTY_FINAL_BLOCK, zlib.length - 2);

  try {
    const out = await inflate(raw, "deflate-raw");

    if (out.length >= expected) {
      return out;
    }
  } catch {
    // A complete stream with a checksum lands here (trailing bytes); use the zlib path.
  }

  return inflate(zlib, "deflate");
}

/** A final fixed-Huffman block holding only the end-of-block code. */
const EMPTY_FINAL_BLOCK = Uint8Array.of(0x03, 0x00);

/** Concatenates `i32 len` + `len` bytes chunks. The string key is zero, so no XOR applies. */
function joinChunks(payload: Uint8Array): Uint8Array {
  const view = new DataView(payload.buffer, payload.byteOffset, payload.byteLength);
  const parts: Uint8Array[] = [];
  let total = 0;
  let pos = 0;

  while (pos + 4 <= payload.length) {
    const len = view.getInt32(pos, true);

    pos += 4;

    if (len < 0 || pos + len > payload.length) {
      throw new Error(`bad pixel chunk length ${len} at ${pos - 4}`);
    }

    parts.push(payload.subarray(pos, pos + len));
    total += len;
    pos += len;
  }

  const out = new Uint8Array(total);
  let at = 0;

  for (const p of parts) {
    out.set(p, at);
    at += p.length;
  }

  return out;
}

/**
 * Inflates with the platform's DecompressionStream. On an error, whatever output was
 * produced before it is returned (the caller checks the length).
 */
async function inflate(data: Uint8Array, format: CompressionFormat): Promise<Uint8Array> {
  const decompressor = new DecompressionStream(format);
  const writer = decompressor.writable.getWriter();
  const reader = decompressor.readable.getReader();

  // Errors surface through the reader; swallow the writer's copy of the same error.
  writer.write(data as BufferSource).catch(() => {});
  writer.close().catch(() => {});

  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    for (;;) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      chunks.push(value);
      total += value.length;
    }
  } catch (error) {
    if (total === 0) {
      throw error;
    }
  }

  const out = new Uint8Array(total);
  let at = 0;

  for (const c of chunks) {
    out.set(c, at);
    at += c.length;
  }

  return out;
}

/** Decompressed bytes a format needs at a stored size (0 when unknown). */
function storedSize(format: number, width: number, height: number): number {
  switch (format) {
    case 1:
    case 513:
      return width * height * 2;

    case 2:
      return width * height * 4;

    case 1026:
    case 2050:
    case 4098:
      return Math.ceil(width / 4) * Math.ceil(height / 4) * 16;

    default:
      return 0;
  }
}

// ---- format conversion ---------------------------------------------------------------

/** Converts decompressed pixel data to RGBA8 at the stored size. */
export function convert(raw: Uint8Array, width: number, height: number, format: number): Uint8Array {
  switch (format) {
    case 1:
      return fromBgra4444(raw, width, height);

    case 2:
      return fromBgra8888(raw, width, height);

    case 513:
      return fromRgb565(raw, width, height);

    case 1026:
      return fromDxt(raw, width, height, "dxt3");

    case 2050:
      return fromDxt(raw, width, height, "dxt5");

    default:
      throw new UnsupportedFormatError(format);
  }
}

function fromBgra4444(raw: Uint8Array, width: number, height: number): Uint8Array {
  const count = width * height;
  const out = new Uint8Array(count * 4);

  for (let i = 0; i < count && i * 2 + 1 < raw.length; i++) {
    const lo = raw[i * 2];
    const hi = raw[i * 2 + 1];
    const o = i * 4;

    // Each 4-bit channel expands to 8 bits by repeating the nibble (x * 17).
    out[o] = (hi & 0x0f) * 17;
    out[o + 1] = (lo >> 4) * 17;
    out[o + 2] = (lo & 0x0f) * 17;
    out[o + 3] = (hi >> 4) * 17;
  }

  return out;
}

function fromBgra8888(raw: Uint8Array, width: number, height: number): Uint8Array {
  const count = width * height;
  const out = new Uint8Array(count * 4);

  for (let i = 0; i < count && i * 4 + 3 < raw.length; i++) {
    const o = i * 4;

    out[o] = raw[o + 2];
    out[o + 1] = raw[o + 1];
    out[o + 2] = raw[o];
    out[o + 3] = raw[o + 3];
  }

  return out;
}

function fromRgb565(raw: Uint8Array, width: number, height: number): Uint8Array {
  const count = width * height;
  const out = new Uint8Array(count * 4);

  for (let i = 0; i < count && i * 2 + 1 < raw.length; i++) {
    const v = raw[i * 2] | (raw[i * 2 + 1] << 8);
    const o = i * 4;

    writeRgb565(out, o, v);
    out[o + 3] = 255;
  }

  return out;
}

function writeRgb565(out: Uint8Array, o: number, v: number): void {
  const r = (v >> 11) & 0x1f;
  const g = (v >> 5) & 0x3f;
  const b = v & 0x1f;

  out[o] = (r << 3) | (r >> 2);
  out[o + 1] = (g << 2) | (g >> 4);
  out[o + 2] = (b << 3) | (b >> 2);
}

// ---- block compression (DXT3 / DXT5) -------------------------------------------------

function fromDxt(raw: Uint8Array, width: number, height: number, kind: "dxt3" | "dxt5"): Uint8Array {
  const out = new Uint8Array(width * height * 4);
  const blocksX = Math.ceil(width / 4);
  const blocksY = Math.ceil(height / 4);
  const color = new Uint8Array(16 * 4);
  const alpha = new Uint8Array(16);

  for (let by = 0; by < blocksY; by++) {
    for (let bx = 0; bx < blocksX; bx++) {
      const block = (by * blocksX + bx) * 16;

      if (block + 16 > raw.length) {
        return out;
      }

      if (kind === "dxt3") {
        explicitAlpha(raw, block, alpha);
      } else {
        interpolatedAlpha(raw, block, alpha);
      }

      colorBlock(raw, block + 8, color);

      for (let py = 0; py < 4; py++) {
        const y = by * 4 + py;

        if (y >= height) {
          break;
        }

        for (let px = 0; px < 4; px++) {
          const x = bx * 4 + px;

          if (x >= width) {
            break;
          }

          const texel = py * 4 + px;
          const o = (y * width + x) * 4;

          out[o] = color[texel * 4];
          out[o + 1] = color[texel * 4 + 1];
          out[o + 2] = color[texel * 4 + 2];
          out[o + 3] = alpha[texel];
        }
      }
    }
  }

  return out;
}

/** DXT3 alpha: 16 explicit 4-bit values. */
function explicitAlpha(raw: Uint8Array, at: number, alpha: Uint8Array): void {
  for (let i = 0; i < 8; i++) {
    const b = raw[at + i];

    alpha[i * 2] = (b & 0x0f) * 17;
    alpha[i * 2 + 1] = (b >> 4) * 17;
  }
}

/** DXT5 alpha: two endpoints and 16 3-bit indices into an interpolated palette. */
function interpolatedAlpha(raw: Uint8Array, at: number, alpha: Uint8Array): void {
  const a0 = raw[at];
  const a1 = raw[at + 1];
  const palette = [a0, a1, 0, 0, 0, 0, 0, 0];

  if (a0 > a1) {
    for (let i = 1; i <= 6; i++) {
      palette[i + 1] = Math.round(((7 - i) * a0 + i * a1) / 7);
    }
  } else {
    for (let i = 1; i <= 4; i++) {
      palette[i + 1] = Math.round(((5 - i) * a0 + i * a1) / 5);
    }

    palette[6] = 0;
    palette[7] = 255;
  }

  // 48 bits of indices, little-endian, 3 bits per texel.
  let bits = 0;
  let bitCount = 0;
  let byte = at + 2;

  for (let i = 0; i < 16; i++) {
    if (bitCount < 3) {
      bits |= raw[byte++] << bitCount;
      bitCount += 8;
    }

    alpha[i] = palette[bits & 7];
    bits >>= 3;
    bitCount -= 3;
  }
}

/** The DXT1-style colour half of a block: two RGB565 endpoints and 2-bit indices. */
function colorBlock(raw: Uint8Array, at: number, color: Uint8Array): void {
  const c0 = raw[at] | (raw[at + 1] << 8);
  const c1 = raw[at + 2] | (raw[at + 3] << 8);
  const palette = new Uint8Array(16);

  writeRgb565(palette, 0, c0);
  writeRgb565(palette, 4, c1);

  // DXT3/5 colour blocks always use the four-colour mode.
  for (let ch = 0; ch < 3; ch++) {
    palette[8 + ch] = Math.round((2 * palette[ch] + palette[4 + ch]) / 3);
    palette[12 + ch] = Math.round((palette[ch] + 2 * palette[4 + ch]) / 3);
  }

  const indices = raw[at + 4] | (raw[at + 5] << 8) | (raw[at + 6] << 16) | (raw[at + 7] << 24);

  for (let i = 0; i < 16; i++) {
    const p = ((indices >>> (i * 2)) & 3) * 4;

    color[i * 4] = palette[p];
    color[i * 4 + 1] = palette[p + 1];
    color[i * 4 + 2] = palette[p + 2];
  }
}

// ---- scaling -------------------------------------------------------------------------

/** Nearest-neighbour upscale: each stored pixel covers a `factor x factor` block. */
function upscale(src: Uint8Array, sw: number, sh: number, width: number, height: number, factor: number): Uint8Array {
  const out = new Uint8Array(width * height * 4);

  for (let y = 0; y < height; y++) {
    const sy = Math.min(sh - 1, Math.floor(y / factor));

    for (let x = 0; x < width; x++) {
      const sx = Math.min(sw - 1, Math.floor(x / factor));
      const s = (sy * sw + sx) * 4;
      const o = (y * width + x) * 4;

      out[o] = src[s];
      out[o + 1] = src[s + 1];
      out[o + 2] = src[s + 2];
      out[o + 3] = src[s + 3];
    }
  }

  return out;
}

/** A visible placeholder for formats we can't decode: magenta checkerboard. */
export function placeholder(width: number, height: number): DecodedImage {
  const rgba = new Uint8Array(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const o = (y * width + x) * 4;
      const on = ((x >> 3) + (y >> 3)) % 2 === 0;

      rgba[o] = 255;
      rgba[o + 1] = 0;
      rgba[o + 2] = on ? 255 : 128;
      rgba[o + 3] = 255;
    }
  }

  return { width, height, rgba };
}
