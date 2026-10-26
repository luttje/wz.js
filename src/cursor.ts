/**
 * Synchronous little-endian readers over parts of a file.
 *
 * Positions are always absolute file offsets, so parsed offsets can be recorded directly.
 *
 * - `Cursor` reads one contiguous in-memory window and throws `OutOfWindow` past it.
 * - `BlockCursor` reads a sparse set of loaded 64 KB blocks and throws `MissingBlock`
 *   for a block that isn't loaded yet. The caller loads it and parses again, which lets
 *   a parser skip large payloads (pixels, audio) without ever reading them.
 */
import { BLOCK_SIZE } from "./source.ts";

export class OutOfWindow extends Error {
  constructor(readonly needed: number) {
    super(`read past window (needed absolute offset ${needed})`);
  }
}

export class MissingBlock extends Error {
  constructor(readonly block: number) {
    super(`block ${block} is not loaded`);
  }
}

/** Scratch space for decoding strings (a plain array: `fromCharCode` takes it fastest). */
const scratch: number[] = [];

/** `String.fromCharCode` over many arguments; sliced so long strings don't overflow the stack. */
const CHAR_SLICE = 4096;

export abstract class Reader {
  pos = 0;

  /** Index in the view returned by the last `locate` (kept in a field to avoid an allocation per read). */
  protected at = 0;

  /** Claims `n` bytes at `pos`, advances `pos`, and returns the view to read them from at `this.at`. */
  protected abstract locate(n: number): DataView;

  u8(): number {
    const view = this.locate(1);
    const index = this.at;

    return view.getUint8(index);
  }

  i8(): number {
    const view = this.locate(1);
    const index = this.at;

    return view.getInt8(index);
  }

  u16(): number {
    const view = this.locate(2);
    const index = this.at;

    return view.getUint16(index, true);
  }

  i16(): number {
    const view = this.locate(2);
    const index = this.at;

    return view.getInt16(index, true);
  }

  u32(): number {
    const view = this.locate(4);
    const index = this.at;

    return view.getUint32(index, true);
  }

  i32(): number {
    const view = this.locate(4);
    const index = this.at;

    return view.getInt32(index, true);
  }

  f32(): number {
    const view = this.locate(4);
    const index = this.at;

    return view.getFloat32(index, true);
  }

  f64(): number {
    const view = this.locate(8);
    const index = this.at;

    return view.getFloat64(index, true);
  }

  i64(): number {
    const view = this.locate(8);
    const index = this.at;

    return toSafeNumber(view.getBigInt64(index, true));
  }

  u64(): number {
    const view = this.locate(8);
    const index = this.at;

    return toSafeNumber(view.getBigUint64(index, true));
  }

  /** The next `n` bytes. May be a view into the underlying buffer, not a copy. */
  bytesAt(n: number): Uint8Array {
    const view = this.locate(n);
    const index = this.at;

    return new Uint8Array(view.buffer, view.byteOffset + index, n);
  }

  skip(n: number): void {
    this.pos += n;
  }

  /** Compressed int: `i8 b`; if `b === -128` an `i32` follows. */
  cint(): number {
    const b = this.i8();

    return b === -128 ? this.i32() : b;
  }

  /**
   * Compressed long: like `cint`, with an `i64` escape. With `rounded`, a value beyond the
   * safe integer range becomes the nearest double instead of throwing (newer clients store
   * sentinels such as 999999999999999999 in properties).
   */
  clong(rounded = false): number {
    const b = this.i8();

    if (b !== -128) {
      return b;
    }

    if (!rounded) {
      return this.i64();
    }

    const view = this.locate(8);
    const index = this.at;

    return Number(view.getBigInt64(index, true));
  }

  /** Null-terminated plain string (the archive header's copyright text). */
  cstr(): string {
    let text = "";

    for (;;) {
      const c = this.u8();

      if (c === 0) {
        return text;
      }

      text += String.fromCharCode(c);
    }
  }

  /** Encrypted string: `i8 len`, then ASCII (len < 0) or UTF-16LE (len > 0), XOR-masked. See docs/wz-format.md. */
  wzString(): string {
    const len = this.i8();

    if (len === 0) {
      return "";
    }

    // Unmasked in place from the view (same masks as `decodeAscii` / `decodeUtf16`): this
    // runs for every name and string in every image, so it avoids per-string allocations.
    if (len < 0) {
      const n = len === -128 ? this.i32() : -len;
      const view = this.locate(n);
      const codes = scratchOf(n);
      let mask = 0xaa;

      for (let k = 0; k < n; k++) {
        codes[k] = (view.getUint8(this.at + k) ^ mask) & 0xff;
        mask = (mask + 1) & 0xff;
      }

      return charsOf(codes, n);
    }

    const units = len === 127 ? this.i32() : len;
    const view = this.locate(units * 2);
    const codes = scratchOf(units);
    let mask = 0xaaaa;

    for (let k = 0; k < units; k++) {
      codes[k] = view.getUint16(this.at + 2 * k, true) ^ mask;
      mask = (mask + 1) & 0xffff;
    }

    return charsOf(codes, units);
  }
}

function scratchOf(n: number): number[] {
  while (scratch.length < n) {
    scratch.push(0);
  }

  return scratch;
}

function charsOf(codes: number[], n: number): string {
  if (n <= CHAR_SLICE) {
    return String.fromCharCode.apply(null, codes.slice(0, n));
  }

  let text = "";

  for (let i = 0; i < n; i += CHAR_SLICE) {
    text += String.fromCharCode.apply(null, codes.slice(i, Math.min(n, i + CHAR_SLICE)));
  }

  return text;
}

/** Reader over one contiguous window; `base` is the absolute offset of `bytes[0]`. */
export class Cursor extends Reader {
  private readonly view: DataView;

  constructor(
    readonly bytes: Uint8Array,
    readonly base = 0,
    pos = base,
  ) {
    super();

    this.view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    this.pos = pos;
  }

  /** Absolute offset just past the window. */
  get end(): number {
    return this.base + this.bytes.length;
  }

  protected locate(n: number): DataView {
    const index = this.pos - this.base;

    if (index < 0 || index + n > this.bytes.length) {
      throw new OutOfWindow(this.pos + n);
    }

    this.pos += n;
    this.at = index;

    return this.view;
  }
}

/** Reader over a sparse map of loaded blocks (block index → bytes). */
export class BlockCursor extends Reader {
  private readonly views = new Map<number, DataView>();

  /** The block read last, which is almost always the one read next. */
  private lastBlock = -1;
  private lastView: DataView | null = null;

  constructor(
    private readonly blocks: Map<number, Uint8Array>,
    pos = 0,
  ) {
    super();

    this.pos = pos;
  }

  protected locate(n: number): DataView {
    const start = this.pos;
    const block = Math.floor(start / BLOCK_SIZE);
    const index = start - block * BLOCK_SIZE;

    this.pos += n;

    // Common case: all bytes inside one block.
    const view = block === this.lastBlock ? this.lastView! : this.viewOf(block);

    if (index + n <= view.byteLength) {
      this.lastBlock = block;
      this.lastView = view;
      this.at = index;

      return view;
    }

    // A short block is the file's last; nothing follows it.
    if (this.bytesOf(block).length < BLOCK_SIZE) {
      throw new RangeError(`read past end of file at ${start}+${n}`);
    }

    // The range crosses blocks: copy it into a temporary buffer.
    const out = new Uint8Array(n);
    let copied = 0;

    while (copied < n) {
      const at = start + copied;
      const b = Math.floor(at / BLOCK_SIZE);
      const from = at - b * BLOCK_SIZE;
      const bytes = this.bytesOf(b);
      const count = Math.min(n - copied, bytes.length - from);

      if (count <= 0) {
        throw new MissingBlock(b);
      }

      out.set(bytes.subarray(from, from + count), copied);
      copied += count;
    }

    this.at = 0;

    return new DataView(out.buffer);
  }

  private bytesOf(block: number): Uint8Array {
    const bytes = this.blocks.get(block);

    if (!bytes) {
      throw new MissingBlock(block);
    }

    return bytes;
  }

  private viewOf(block: number): DataView {
    let view = this.views.get(block);

    if (!view) {
      const bytes = this.bytesOf(block);

      view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      this.views.set(block, view);
    }

    return view;
  }
}

function toSafeNumber(value: bigint): number {
  const n = Number(value);

  if (!Number.isSafeInteger(n)) {
    throw new RangeError(`64-bit value ${value} is not a safe integer`);
  }

  return n;
}
