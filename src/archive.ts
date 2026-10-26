/**
 * PKG1 archive: header, directory tree and version auto-detection. See docs/wz-format.md.
 *
 * An archive is opened once; its directory is parsed eagerly (it is small), while image
 * contents are parsed lazily by `image.ts`.
 */
import { decryptOffset, encVerOf, versionHash } from "./crypto.ts";
import { Cursor, OutOfWindow } from "./cursor.ts";
import type { ByteSource } from "./source.ts";

export const PKG1_MAGIC = "PKG1";

/** Highest version tried during auto-detection. */
const MAX_VERSION = 2000;

/** Initial directory read window; it grows on demand. */
const INITIAL_WINDOW = 64 * 1024;

export interface ArchiveHeader {
  magic: string;
  /** Size of the data section (from `fstart` to end of file). */
  fsize: number;
  /** Offset of the content section. */
  fstart: number;
  copyright: string;
  /** The 16-bit version check value stored at `fstart`. */
  encVer: number;
}

/** Anything that holds images: a PKG1 archive or a decrypted `.ms` pack entry. */
export interface ImageContainer {
  readonly name: string;
  readonly source: ByteSource;
}

export interface ImageEntry {
  readonly kind: "img";
  readonly name: string;
  readonly archive: ImageContainer;
  /** Size in bytes of the serialized image. */
  readonly size: number;
  readonly checksum: number;
  /** Absolute file offset of the image's first byte. */
  readonly offset: number;
}

export interface DirectoryEntry {
  readonly kind: "dir";
  readonly name: string;
  readonly size: number;
  readonly checksum: number;
  readonly offset: number;
  readonly entries: ArchiveEntry[];
}

export type ArchiveEntry = ImageEntry | DirectoryEntry;

/** A directory entry as plain data (see `WzArchive.layout`); directories have `entries`. */
export interface LayoutEntry {
  name: string;
  size: number;
  checksum: number;
  offset: number;
  entries?: LayoutEntry[];
}

/** An opened archive's header and directory as plain data. */
export interface ArchiveLayout {
  header: ArchiveHeader;
  version: number | null;
  root: LayoutEntry[];
}

/** Raw entry as read, before any offset is decrypted. */
interface RawEntry {
  type: 3 | 4;
  name: string;
  size: number;
  checksum: number;
  /** File position of the encrypted offset field. */
  offsetPos: number;
  encryptedOffset: number;
}

export class WzFormatError extends Error {}

export class WzArchive implements ImageContainer {
  /** Root directory entries. Empty until `open` succeeds. */
  root: ArchiveEntry[] = [];

  /** Detected game version, or null if the archive holds no entries to test against. */
  version: number | null = null;

  /** Count of entries of type 1 (skipped) and 2 (indirect name), for the format docs. */
  readonly stats = { skippedType1: 0, indirectType2: 0 };

  private constructor(
    readonly source: ByteSource,
    readonly header: ArchiveHeader,
  ) {}

  get name(): string {
    return this.source.name;
  }

  /**
   * Opens an archive and parses its directory.
   *
   * @param knownVersion skip auto-detection and use this version (it must still validate)
   */
  static async open(source: ByteSource, knownVersion?: number): Promise<WzArchive> {
    const header = await readHeader(source);
    const archive = new WzArchive(source, header);

    await archive.parseDirectory(knownVersion);

    return archive;
  }

  /**
   * Reopens an archive from an earlier `layout()` of the same file (e.g. on another
   * thread) without reading anything.
   */
  static restore(source: ByteSource, layout: ArchiveLayout): WzArchive {
    const archive = new WzArchive(source, layout.header);

    const toEntries = (entries: LayoutEntry[]): ArchiveEntry[] =>
      entries.map((e) =>
        e.entries
          ? { kind: "dir", name: e.name, size: e.size, checksum: e.checksum, offset: e.offset, entries: toEntries(e.entries) }
          : { kind: "img", name: e.name, archive, size: e.size, checksum: e.checksum, offset: e.offset },
      );

    archive.root = toEntries(layout.root);
    archive.version = layout.version;

    return archive;
  }

  /** The header and parsed directory as plain data, for `restore`. */
  layout(): ArchiveLayout {
    const toLayout = (entries: ArchiveEntry[]): LayoutEntry[] =>
      entries.map((e) =>
        e.kind === "dir"
          ? { name: e.name, size: e.size, checksum: e.checksum, offset: e.offset, entries: toLayout(e.entries) }
          : { name: e.name, size: e.size, checksum: e.checksum, offset: e.offset },
      );

    return { header: this.header, version: this.version, root: toLayout(this.root) };
  }

  /** All images in the archive, depth first. */
  *images(): Generator<ImageEntry> {
    const stack: ArchiveEntry[][] = [this.root];

    while (stack.length > 0) {
      const entries = stack.pop()!;

      for (const entry of entries) {
        if (entry.kind === "img") {
          yield entry;
        } else {
          stack.push(entry.entries);
        }
      }
    }
  }

  private async parseDirectory(knownVersion?: number): Promise<void> {
    const candidates = knownVersion !== undefined ? [knownVersion] : this.candidateVersions();

    for (const version of candidates) {
      const hash = versionHash(version);
      const tree = await this.tryParse(this.header.fstart + 2, hash);

      if (tree && this.isPlausible(tree)) {
        this.root = tree;

        // Without images there is no offset to test, so every candidate "validates".
        const hasImages = !collectImages(tree).next().done;

        this.version = hasImages ? version : null;

        return;
      }
    }

    // No version produced a valid tree. An archive without entries validates under any
    // version, so reaching here means real data that we can't place.
    throw new WzFormatError(`${this.name}: no version in 1..${MAX_VERSION} yields a valid directory`);
  }

  private candidateVersions(): number[] {
    const versions: number[] = [];

    for (let v = 1; v <= MAX_VERSION; v++) {
      if (encVerOf(versionHash(v)) === this.header.encVer) {
        versions.push(v);
      }
    }

    return versions;
  }

  /** Parses the directory at `offset` with one version hash; null if any offset is out of range. */
  private async tryParse(offset: number, hash: number): Promise<ArchiveEntry[] | null> {
    const raw = await this.readRawDirectory(offset);
    const entries: ArchiveEntry[] = [];

    for (const r of raw) {
      const target = decryptOffset(r.offsetPos, r.encryptedOffset, this.header.fstart, hash);

      if (target < this.header.fstart || target >= this.source.size) {
        return null;
      }

      if (r.type === 4) {
        entries.push({
          kind: "img",
          name: r.name,
          archive: this,
          size: r.size,
          checksum: r.checksum,
          offset: target,
        });

        continue;
      }

      const children = await this.tryParse(target, hash);

      if (!children) {
        return null;
      }

      entries.push({
        kind: "dir",
        name: r.name,
        size: r.size,
        checksum: r.checksum,
        offset: target,
        entries: children,
      });
    }

    return entries;
  }

  /** Images must lie inside the file and must not overlap one another. */
  private isPlausible(tree: ArchiveEntry[]): boolean {
    const images = [...collectImages(tree)].sort((a, b) => a.offset - b.offset);

    for (let i = 0; i < images.length; i++) {
      const image = images[i];

      if (image.offset + image.size > this.source.size) {
        return false;
      }

      const next = images[i + 1];

      if (next && image.offset + image.size > next.offset) {
        return false;
      }
    }

    return true;
  }

  /** Reads one directory listing, growing the read window until it fits. */
  private async readRawDirectory(offset: number): Promise<RawEntry[]> {
    let window = INITIAL_WINDOW;

    for (;;) {
      const bytes = await this.source.readRange(offset, window);
      const cursor = new Cursor(bytes, offset);

      try {
        return await this.parseRawDirectory(cursor);
      } catch (error) {
        const canGrow = offset + window < this.source.size;

        if (!(error instanceof OutOfWindow) || !canGrow) {
          throw error;
        }

        window *= 4;
      }
    }
  }

  private async parseRawDirectory(cursor: Cursor): Promise<RawEntry[]> {
    const count = cursor.cint();

    if (count < 0 || count > 1_000_000) {
      throw new WzFormatError(`${this.name}: implausible directory count ${count} at ${cursor.pos}`);
    }

    const entries: RawEntry[] = [];

    for (let i = 0; i < count; i++) {
      const type = cursor.u8();

      if (type === 1) {
        // Unknown purpose; always 10 bytes.
        cursor.skip(10);
        this.stats.skippedType1++;

        continue;
      }

      let realType: number;
      let name: string;

      if (type === 2) {
        // The real type byte and name live elsewhere in the file.
        const nameOffset = this.header.fstart + cursor.i32();

        ({ type: realType, name } = await this.readIndirectName(nameOffset));
        this.stats.indirectType2++;
      } else if (type === 3 || type === 4) {
        realType = type;
        name = cursor.wzString();
      } else {
        throw new WzFormatError(`${this.name}: unknown directory entry type ${type} at ${cursor.pos - 1}`);
      }

      if (realType !== 3 && realType !== 4) {
        throw new WzFormatError(`${this.name}: indirect entry has type ${realType}`);
      }

      const size = cursor.cint();
      const checksum = cursor.cint();
      const offsetPos = cursor.pos;
      const encryptedOffset = cursor.u32();

      entries.push({ type: realType, name, size, checksum, offsetPos, encryptedOffset });
    }

    return entries;
  }

  private async readIndirectName(offset: number): Promise<{ type: number; name: string }> {
    const bytes = await this.source.readRange(offset, 4096);
    const cursor = new Cursor(bytes, offset);
    const type = cursor.u8();
    const name = cursor.wzString();

    return { type, name };
  }
}

function* collectImages(entries: ArchiveEntry[]): Generator<ImageEntry> {
  for (const entry of entries) {
    if (entry.kind === "img") {
      yield entry;
    } else {
      yield* collectImages(entry.entries);
    }
  }
}

export async function readHeader(source: ByteSource): Promise<ArchiveHeader> {
  const bytes = await source.readRange(0, 1024);
  const cursor = new Cursor(bytes);
  const magic = String.fromCharCode(...cursor.bytesAt(4));

  if (magic !== PKG1_MAGIC) {
    throw new WzFormatError(`${source.name}: magic is "${magic}", expected "${PKG1_MAGIC}"`);
  }

  const fsize = cursor.u64();
  const fstart = cursor.u32();
  const copyright = cursor.cstr();

  cursor.pos = fstart;

  const encVer = cursor.u16();

  return { magic, fsize, fstart, copyright, encVer };
}
