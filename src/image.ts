/**
 * `.img` property parser. See docs/wz-format.md for the verified layout.
 *
 * An image is read through a `BlockCursor`: only the 64 KB blocks that hold property
 * metadata are fetched, so large pixel and audio payloads are skipped without reading.
 */
import type { ImageEntry } from "./archive.ts";
import { BlockCursor, MissingBlock, type Reader } from "./cursor.ts";
import { WzNode, type NodeKind, type NodeOwner, type Vector } from "./node.ts";
import { BLOCK_SIZE, type ByteSource } from "./source.ts";

/** Bytes fetched up front for each image; the rest is fetched block by block on demand. */
const PREFETCH_BYTES = 1024 * 1024;

/** Most blocks fetched for one missing block (16 MB) once the read-ahead has grown. */
const MAX_READ_AHEAD_BLOCKS = 256;

export class ImageFormatError extends Error {}

/**
 * Optional counters filled while parsing, used to document what the data really contains
 * (property types, extended-object names, canvas formats, sound header sizes, oddities).
 */
export class FormatStats {
  readonly propertyTypes = new Map<number, number>();
  readonly extendedTypes = new Map<string, number>();
  readonly stringMarkers = new Map<number, number>();
  readonly canvasFormats = new Map<string, number>();
  readonly soundHeaderSizes = new Map<number, number>();
  readonly notes = new Map<string, number>();

  bump<K>(map: Map<K, number>, key: K): void {
    map.set(key, (map.get(key) ?? 0) + 1);
  }

  note(text: string): void {
    this.bump(this.notes, text);
  }
}

/** Parses one image into a node tree. */
export async function parseImage(entry: ImageEntry, owner: NodeOwner, stats?: FormatStats): Promise<WzNode> {
  const source = entry.archive.source;
  const blocks = await prefetch(source, entry.offset, Math.min(entry.size, PREFETCH_BYTES));
  const lastBlock = Math.floor((entry.offset + Math.max(entry.size, 1) - 1) / BLOCK_SIZE);
  let misses = 0;
  const strings = new Map<number, string>();

  for (;;) {
    const cursor = new BlockCursor(blocks, entry.offset);
    const parser = new ImageParser(cursor, entry, owner, source, strings, stats);

    try {
      return parser.parse();
    } catch (error) {
      if (!(error instanceof MissingBlock)) {
        throw error;
      }

      // Fetch the missing block and parse again from the start. Parsing is cheap compared
      // with I/O, and this keeps the parser synchronous. Large images whose metadata is
      // spread over many blocks (a sound image of hundreds of MB) would need one restart
      // per block, so the read-ahead doubles every second miss.
      const index = error.block;
      const span = Math.min(MAX_READ_AHEAD_BLOCKS, 2 ** Math.floor(misses / 2), Math.max(1, lastBlock - index + 1));
      const fetched = await prefetch(source, index * BLOCK_SIZE, span * BLOCK_SIZE);

      if (!fetched.has(index)) {
        throw new ImageFormatError(`${owner.path}: read past end of ${source.name}`);
      }

      for (const [i, bytes] of fetched) {
        if (!blocks.has(i)) {
          blocks.set(i, bytes);
        }
      }

      misses++;
    }
  }
}

/** Loads the blocks covering `[offset, offset + length)` with one read. */
async function prefetch(source: ByteSource, offset: number, length: number): Promise<Map<number, Uint8Array>> {
  const blocks = new Map<number, Uint8Array>();
  const first = Math.floor(offset / BLOCK_SIZE);
  const last = Math.floor((offset + Math.max(length, 1) - 1) / BLOCK_SIZE);
  const start = first * BLOCK_SIZE;
  const bytes = await source.readRange(start, (last - first + 1) * BLOCK_SIZE);

  for (let i = first; i <= last; i++) {
    const from = (i - first) * BLOCK_SIZE;

    if (from >= bytes.length) {
      break;
    }

    blocks.set(i, bytes.subarray(from, Math.min(bytes.length, from + BLOCK_SIZE)));
  }

  return blocks;
}

class ImageParser {
  private readonly start: number;

  constructor(
    private readonly r: Reader,
    private readonly entry: ImageEntry,
    private readonly owner: NodeOwner,
    private readonly source: ByteSource,
    /** Strings referenced by offset, which repeat (property names); kept across restarts. */
    private readonly strings: Map<number, string>,
    private readonly stats?: FormatStats,
  ) {
    this.start = entry.offset;
  }

  parse(): WzNode {
    const type = this.typeName();

    if (type !== "Property") {
      throw new ImageFormatError(`${this.owner.path}: image starts with "${type}", expected "Property"`);
    }

    const root = new WzNode(this.owner, null, "", "property", "Property");

    this.propertyList(root);

    const end = this.start + this.entry.size;

    if (this.r.pos !== end) {
      this.stats?.note(`image ends at ${this.r.pos - this.start} of declared ${this.entry.size} bytes`);
    }

    return root;
  }

  // ---- strings -----------------------------------------------------------------------

  /** A property name or string value: inline (0x00, 0x73) or by offset (0x01, 0x1B). */
  private stringBlock(): string {
    const marker = this.r.u8();

    this.stats?.bump(this.stats.stringMarkers, marker);

    switch (marker) {
      case 0x00:
      case 0x73:
        return this.r.wzString();

      case 0x01:
      case 0x1b:
        return this.stringAt(this.start + this.r.i32());

      default:
        throw new ImageFormatError(`${this.owner.path}: unknown string marker 0x${hex(marker)} at ${this.r.pos - 1}`);
    }
  }

  private stringAt(offset: number): string {
    const cached = this.strings.get(offset);

    if (cached !== undefined) {
      return cached;
    }

    const back = this.r.pos;

    this.r.pos = offset;

    const text = this.r.wzString();

    this.r.pos = back;
    this.strings.set(offset, text);

    return text;
  }

  /** Extended-object type names use the same markers as string blocks. */
  private typeName(): string {
    return this.stringBlock();
  }

  // ---- properties --------------------------------------------------------------------

  private propertyList(parent: WzNode): void {
    const reserved = this.r.u16();

    if (reserved !== 0) {
      this.stats?.note(`property list reserved u16 = ${reserved}`);
    }

    const count = this.r.cint();

    if (count < 0 || count > 10_000_000) {
      throw new ImageFormatError(`${this.owner.path}: implausible property count ${count}`);
    }

    for (let i = 0; i < count; i++) {
      const name = this.stringBlock();
      const type = this.r.u8();

      this.stats?.bump(this.stats.propertyTypes, type);
      parent.addChild(this.property(parent, name, type));
    }
  }

  private property(parent: WzNode, name: string, type: number): WzNode {
    switch (type) {
      case 0x00:
        return this.leaf(parent, name, type, "null", null);

      case 0x02:
      case 0x0b:
        return this.leaf(parent, name, type, "short", this.r.i16());

      case 0x03:
      case 0x13:
        return this.leaf(parent, name, type, "int", this.r.cint());

      case 0x14: {
        const value = this.r.clong(true);

        if (!Number.isSafeInteger(value)) {
          this.stats?.note("long value beyond 2^53 (rounded)");
        }

        return this.leaf(parent, name, type, "long", value);
      }

      case 0x04: {
        const flag = this.r.u8();

        return this.leaf(parent, name, type, "float", flag === 0x80 ? this.r.f32() : 0);
      }

      case 0x05:
        return this.leaf(parent, name, type, "double", this.r.f64());

      case 0x08:
        return this.leaf(parent, name, type, "string", this.stringBlock());

      case 0x09: {
        const blockSize = this.r.u32();
        const blockEnd = this.r.pos + blockSize;
        const node = this.extended(parent, name, blockEnd);

        if (this.r.pos !== blockEnd) {
          this.stats?.note(`${node.rawType} block parsed to ${this.r.pos - blockEnd} bytes from its declared end`);
        }

        this.r.pos = blockEnd;

        return node;
      }

      default:
        throw new ImageFormatError(`${this.owner.path}: unknown property type 0x${hex(type)} for "${name}" at ${this.r.pos - 1}`);
    }
  }

  private leaf(parent: WzNode, name: string, type: number, kind: NodeKind, value: number | string | null): WzNode {
    return new WzNode(this.owner, parent, name, kind, RAW_TYPES[type], value);
  }

  /**
   * An extended object. `blockEnd` is known when the object sits in a sized 0x09 block,
   * and is needed to locate sound payloads.
   */
  private extended(parent: WzNode | null, name: string, blockEnd?: number): WzNode {
    const type = this.typeName();

    this.stats?.bump(this.stats.extendedTypes, type);

    switch (type) {
      case "Property": {
        const node = new WzNode(this.owner, parent, name, "property", type);

        this.propertyList(node);

        return node;
      }

      case "Canvas":
        return this.canvas(parent, name);

      case "Shape2D#Vector2D": {
        const value: Vector = { x: this.r.cint(), y: this.r.cint() };

        return new WzNode(this.owner, parent, name, "vector", type, value);
      }

      case "Shape2D#Convex2D": {
        const node = new WzNode(this.owner, parent, name, "convex", type);
        const count = this.r.cint();

        for (let i = 0; i < count; i++) {
          node.addChild(this.extended(node, String(i)));
        }

        return node;
      }

      case "UOL": {
        const reserved = this.r.u8();

        if (reserved !== 0) {
          this.stats?.note(`UOL reserved byte = ${reserved}`);
        }

        return new WzNode(this.owner, parent, name, "uol", type, this.stringBlock());
      }

      case "Sound_DX8":
        return this.sound(parent, name, blockEnd);

      default:
        if (blockEnd === undefined) {
          throw new ImageFormatError(`${this.owner.path}: unknown extended type "${type}" outside a sized block`);
        }

        // The enclosing block is sized, so an unknown object can be skipped safely.
        this.stats?.note(`unknown extended type "${type}"`);

        return new WzNode(this.owner, parent, name, "unknown", type);
    }
  }

  private canvas(parent: WzNode | null, name: string): WzNode {
    const reserved = this.r.u8();

    if (reserved !== 0) {
      this.stats?.note(`canvas reserved byte = ${reserved}`);
    }

    const hasProps = this.r.u8();

    // The pixel description follows the children, so the value is filled in at the end.
    const node = new WzNode(this.owner, parent, name, "canvas", "Canvas");

    if (hasProps === 1) {
      this.propertyList(node);
    } else if (hasProps !== 0) {
      this.stats?.note(`canvas hasProps = ${hasProps}`);
    }

    const width = this.r.cint();
    const height = this.r.cint();
    const format = this.r.cint();
    const scale = this.r.u8();
    const reserved2 = this.r.i32();
    const dataLen = this.r.i32();
    const reserved3 = this.r.u8();

    if (reserved2 !== 0) {
      this.stats?.note(`canvas reserved i32 = ${reserved2}`);
    }

    if (reserved3 !== 0) {
      this.stats?.note(`canvas payload lead byte = ${reserved3}`);
    }

    const dataOffset = this.r.pos;
    const dataLength = Math.max(0, dataLen - 1);

    this.r.skip(dataLength);
    this.stats?.bump(this.stats.canvasFormats, `${format}/${scale}`);

    node.value = {
      width,
      height,
      format,
      scale,
      source: this.source,
      dataOffset,
      dataLength,
    };

    return node;
  }

  private sound(parent: WzNode | null, name: string, blockEnd?: number): WzNode {
    if (blockEnd === undefined) {
      throw new ImageFormatError(`${this.owner.path}: Sound_DX8 outside a sized block`);
    }

    const reserved = this.r.u8();

    if (reserved !== 0) {
      this.stats?.note(`sound reserved byte = ${reserved}`);
    }

    const dataLength = this.r.cint();
    const durationMs = this.r.cint();
    const dataOffset = blockEnd - dataLength;
    const headerLength = dataOffset - this.r.pos;

    if (headerLength < 0) {
      throw new ImageFormatError(`${this.owner.path}/${name}: sound payload overlaps its header`);
    }

    const header = this.r.bytesAt(headerLength).slice();

    this.stats?.bump(this.stats.soundHeaderSizes, headerLength);
    this.r.pos = blockEnd;

    return new WzNode(this.owner, parent, name, "sound", "Sound_DX8", {
      source: this.source,
      durationMs,
      dataOffset,
      dataLength,
      header,
    });
  }
}

/** `0x03`-style labels for the property types, built once. */
const RAW_TYPES = Array.from({ length: 256 }, (_, i) => `0x${hex(i)}`);

function hex(n: number): string {
  return n.toString(16).toUpperCase().padStart(2, "0");
}
