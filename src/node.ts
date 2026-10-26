/**
 * In-image property nodes. See docs/api.md.
 *
 * A parsed image is a tree of `WzNode`s. Navigation and typed getters are synchronous;
 * crossing into another image goes through `WzFileSystem`, which is asynchronous.
 */
import type { ByteSource } from "./source.ts";

export type NodeKind =
  | "property"
  | "null"
  | "short"
  | "int"
  | "long"
  | "float"
  | "double"
  | "string"
  | "vector"
  | "convex"
  | "canvas"
  | "sound"
  | "uol"
  | "unknown";

export interface Vector {
  x: number;
  y: number;
}

/** Location and shape of a canvas's pixel payload. Pixels are decoded only on request. */
export interface CanvasData {
  width: number;
  height: number;
  /** Pixel format id (1, 2, 513, 517, 1026, 2050, ...). */
  format: number;
  /** The byte after `format`: stored size is `width >> scale` by `height >> scale`. */
  scale: number;
  source: ByteSource;
  /** Absolute offset of the payload (after the leading zero byte). */
  dataOffset: number;
  dataLength: number;
}

export interface SoundData {
  source: ByteSource;
  durationMs: number;
  /** Absolute offset and length of the audio payload. */
  dataOffset: number;
  dataLength: number;
  /** The media-type header between the duration and the payload. */
  header: Uint8Array;
}

/** Anything a node can hold besides children. */
export type NodeValue = null | number | string | Vector | CanvasData | SoundData;

/** The minimal image identity a node needs for its path and diagnostics. */
export interface NodeOwner {
  /** Tree-relative image path, e.g. `Npc/1012100.img`. */
  readonly path: string;
}

/** Maximum UOL hops before giving up (guards against cycles). */
const MAX_UOL_HOPS = 16;

/** Above this many children, name lookups use a map instead of a scan. */
const INDEX_THRESHOLD = 8;

export class WzNode {
  private kids: WzNode[] | null = null;
  private index: Map<string, WzNode> | null = null;

  constructor(
    readonly owner: NodeOwner,
    readonly parent: WzNode | null,
    readonly name: string,
    readonly kind: NodeKind,
    /** Serialized type: a hex property type (`0x03`) or an extended-object name (`Canvas`). */
    readonly rawType: string,
    /** Set once by the parser (a canvas's value is known only after its children). */
    public value: NodeValue = null,
  ) {}

  // ---- structure -------------------------------------------------------------------

  /** Used by the parser only. */
  addChild(child: WzNode): void {
    if (!this.kids) {
      this.kids = [];
    }

    this.kids.push(child);
    this.index = null;
  }

  /** Child nodes in stored order. UOL children are returned unresolved. */
  children(): readonly WzNode[] {
    return this.kids ?? EMPTY;
  }

  get childCount(): number {
    return this.kids?.length ?? 0;
  }

  /** Path from the tree root, e.g. `Npc/1012100.img/stand/0`. */
  get path(): string {
    const names: string[] = [];

    for (let n: WzNode | null = this; n?.parent; n = n.parent) {
      names.push(n.name);
    }

    names.reverse();

    return names.length ? `${this.owner.path}/${names.join("/")}` : this.owner.path;
  }

  /** The image's root node. */
  get root(): WzNode {
    let n: WzNode = this;

    while (n.parent) {
      n = n.parent;
    }

    return n;
  }

  /** Direct child by name, without UOL resolution. */
  child(name: string): WzNode | undefined {
    const kids = this.kids;

    if (!kids) {
      return undefined;
    }

    if (kids.length <= INDEX_THRESHOLD) {
      return kids.find((k) => k.name === name);
    }

    if (!this.index) {
      this.index = new Map();

      for (const k of kids) {
        // First occurrence wins when names repeat.
        if (!this.index.has(k.name)) {
          this.index.set(k.name, k);
        }
      }
    }

    return this.index.get(name);
  }

  /**
   * Resolves a slash path relative to this node. Accepts `..` and `.`; UOLs met along
   * the way (and at the end) are followed. Returns undefined if any step is missing or
   * leaves the image.
   */
  get(path: string | number): WzNode | undefined {
    return this.walk(String(path), { hops: MAX_UOL_HOPS });
  }

  // ---- UOL ---------------------------------------------------------------------------

  /** Follows UOL links to their target. Non-UOL nodes return themselves. */
  resolve(): WzNode | undefined {
    return this.follow({ hops: MAX_UOL_HOPS });
  }

  /**
   * `walk` and `follow` call each other (a UOL path may cross other UOLs), so they share
   * one hop budget; a cycle exhausts it and yields undefined.
   */
  private walk(path: string, budget: { hops: number }): WzNode | undefined {
    let node: WzNode | undefined = this.follow(budget);

    for (const part of path.split("/")) {
      if (!node) {
        return undefined;
      }

      // A node may really be named "." (the decimal point in number fonts).
      if (part === "" || (part === "." && !node.child("."))) {
        continue;
      }

      if (part === "..") {
        node = node.parent ?? undefined;

        continue;
      }

      node = node.child(part)?.follow(budget);
    }

    return node;
  }

  private follow(budget: { hops: number }): WzNode | undefined {
    let node: WzNode = this;

    while (node.kind === "uol") {
      if (budget.hops-- <= 0) {
        return undefined;
      }

      // A UOL is relative to the node that contains it.
      const target: WzNode | undefined = node.parent?.walk(node.value as string, budget);

      if (!target) {
        return undefined;
      }

      node = target;
    }

    return node;
  }

  /** The unresolved link text of a UOL node; undefined for other kinds. */
  raw(): string | undefined {
    return this.kind === "uol" ? (this.value as string) : undefined;
  }

  // ---- typed getters -----------------------------------------------------------------
  //
  // Each getter accepts an optional path, resolves it (with UOLs), and converts.
  // Numeric strings are common in WZ data, so `int` and `float` parse them.

  int(def = 0, path?: string | number): number {
    const v = this.at(path)?.value;

    if (typeof v === "number") {
      return Math.trunc(v);
    }

    if (typeof v === "string" && v.trim() !== "") {
      const n = Number(v);

      return Number.isFinite(n) ? Math.trunc(n) : def;
    }

    return def;
  }

  float(def = 0, path?: string | number): number {
    const v = this.at(path)?.value;

    if (typeof v === "number") {
      return v;
    }

    if (typeof v === "string" && v.trim() !== "") {
      const n = Number(v);

      return Number.isFinite(n) ? n : def;
    }

    return def;
  }

  string(def = "", path?: string | number): string {
    const v = this.at(path)?.value;

    if (typeof v === "string") {
      return v;
    }

    if (typeof v === "number") {
      return String(v);
    }

    return def;
  }

  vector(path?: string | number): Vector | undefined {
    const n = this.at(path);

    return n?.kind === "vector" ? (n.value as Vector) : undefined;
  }

  canvas(path?: string | number): CanvasData | undefined {
    const n = this.at(path);

    return n?.kind === "canvas" ? (n.value as CanvasData) : undefined;
  }

  sound(path?: string | number): SoundData | undefined {
    const n = this.at(path);

    return n?.kind === "sound" ? (n.value as SoundData) : undefined;
  }

  /** True when this (resolved) node holds a plain scalar. */
  get isScalar(): boolean {
    const k = this.resolve()?.kind;

    return k === "short" || k === "int" || k === "long" || k === "float" || k === "double" || k === "string";
  }

  private at(path?: string | number): WzNode | undefined {
    return path === undefined ? this.resolve() : this.get(path);
  }
}

const EMPTY: readonly WzNode[] = Object.freeze([]);
