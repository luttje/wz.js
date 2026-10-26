/**
 * Mounts a game `Data` folder as one virtual tree.
 *
 * On disk every folder `X` holds `X.ini` (`LastWzIndex|N`), a stub `X.wz` that lists the
 * folder's sub-folders, and archives `X_000.wz` … `X_00N.wz` with the images. Sub-folders
 * follow the same pattern. Paths stay tree-relative, so `Npc/1012100.img/info` works no
 * matter which part-archive holds the image. See docs/data-layout.md.
 */
import { WzArchive, type ArchiveEntry, type ArchiveLayout, type ImageEntry } from "./archive.ts";
import { FormatStats, parseImage } from "./image.ts";
import { WzNode, type CanvasData, type NodeOwner } from "./node.ts";
import { MsPack, type PackLayout } from "./ms/pack.ts";
import { CachedSource, type ByteSource } from "./source.ts";

/** One file from the data folder; `path` is relative to `Data`, with forward slashes. */
export interface DataFile {
  path: string;
  source: ByteSource;
}

export interface MountOptions {
  /** Parsed images kept in memory before the least recently used are dropped. */
  maxLoadedImages?: number;
  /** Collects format statistics while parsing (tools only). */
  stats?: FormatStats;
  /** Wraps each source in a 64 KB block cache (default true). */
  cache?: boolean;
  /** Blocks each source's cache keeps before dropping the least recently used (default 256). */
  cacheBlocks?: number;
  /**
   * The `layout()` of an earlier mount of the same files: the tree is rebuilt from it
   * without reading any archive directory (e.g. to mount again on another thread).
   */
  layout?: MountLayout;
}

/** A mount's archive directories and pack tables as plain data (see `WzFileSystem.layout`). */
export interface MountLayout {
  version: number | null;
  archives: ({ path: string } & ArchiveLayout)[];
  packs: ({ path: string } & PackLayout)[];
  warnings: string[];
  unsupported: string[];
}

export class WzDirectory {
  readonly dirs = new Map<string, WzDirectory>();
  readonly images = new Map<string, WzImage>();

  constructor(
    readonly name: string,
    readonly path: string,
  ) {}

  /** Sub-directories then images, each sorted by name. */
  entries(): (WzDirectory | WzImage)[] {
    const dirs = [...this.dirs.values()].sort(byName);
    const images = [...this.images.values()].sort(byName);

    return [...dirs, ...images];
  }
}

export class WzImage implements NodeOwner {
  private loading: Promise<WzNode> | null = null;

  constructor(
    readonly name: string,
    readonly path: string,
    readonly entry: ImageEntry,
    private readonly fs: WzFileSystem,
  ) {}

  /** Parses the image on first access; concurrent callers share one parse. */
  load(): Promise<WzNode> {
    if (!this.loading) {
      this.loading = parseImage(this.entry, this, this.fs.stats);
      this.loading.catch(() => {
        this.loading = null;
      });
    }

    this.fs.touch(this);

    return this.loading;
  }

  get isLoaded(): boolean {
    return this.loading !== null;
  }

  /** Drops the parsed tree; nodes already handed out stay valid. */
  unload(): void {
    this.loading = null;
  }
}

export interface ArchiveInfo {
  path: string;
  size: number;
  version: number | null;
  images: number;
  /** `wz` for PKG1 archives, `ms` for encrypted packs. */
  kind: "wz" | "ms";
}

export class WzFileSystem {
  readonly root = new WzDirectory("", "");

  /** The game version shared by the archives (the most common detected one). */
  version: number | null = null;

  readonly archives: ArchiveInfo[] = [];

  /** Files the reader couldn't open (e.g. a pack in an unknown layout). */
  readonly unsupported: string[] = [];

  /** Non-image entries found inside packs. */
  readonly otherFiles: { path: string; size: number; container: string }[] = [];

  /** Non-fatal problems found while mounting. */
  readonly warnings: string[] = [];

  readonly stats?: FormatStats;

  private readonly maxLoaded: number;
  private readonly loaded = new Set<WzImage>();

  /** What was mounted, in order, for `layout()`. */
  private readonly mountedArchives: { path: string; archive: WzArchive }[] = [];
  private readonly mountedPacks: { path: string; pack: MsPack }[] = [];

  private constructor(options: MountOptions) {
    this.stats = options.stats;
    this.maxLoaded = options.maxLoadedImages ?? 512;
  }

  /** Opens every archive in `files` and builds the virtual tree. */
  static async open(files: DataFile[], options: MountOptions = {}): Promise<WzFileSystem> {
    const fs = new WzFileSystem(options);
    const useCache = options.cache ?? true;
    const wrapSource = (source: ByteSource) => (useCache ? new CachedSource(source, options.cacheBlocks) : source);

    if (options.layout) {
      fs.restore(files, options.layout, wrapSource);

      return fs;
    }

    const wzFiles = files.filter((f) => f.path.toLowerCase().endsWith(".wz"));
    const iniFiles = files.filter((f) => f.path.toLowerCase().endsWith(".ini"));
    const msFiles = files.filter((f) => f.path.toLowerCase().endsWith(".ms"));

    // An archive that can't be opened (truncated, not PKG1, an unknown version) is left
    // out and reported; the rest still mounts.
    const results = await Promise.all(
      wzFiles.map(async (f) => {
        const source = wrapSource(f.source);

        try {
          return { file: f, archive: await WzArchive.open(source) };
        } catch (error) {
          fs.unsupported.push(f.path);
          fs.warnings.push(fileProblem(f.path, error));

          return null;
        }
      }),
    );

    const opened = results.filter((r) => r !== null);

    // Mount in path order so stubs and parts merge deterministically.
    opened.sort((a, b) => a.file.path.localeCompare(b.file.path));

    for (const { file, archive } of opened) {
      fs.mount(file.path, archive);
    }

    fs.version = mostCommon(opened.map((o) => o.archive.version));

    for (const { file, archive } of opened) {
      if (archive.version !== null && archive.version !== fs.version) {
        fs.warnings.push(`${file.path}: version ${archive.version} differs from ${fs.version}`);
      }
    }

    await fs.checkIniFiles(iniFiles, [...wzFiles, ...msFiles]);

    // Packs come last: their images join the trees the archives created (Mob, Skill).
    msFiles.sort((a, b) => a.path.localeCompare(b.path));

    for (const f of msFiles) {
      await fs.mountPack(f, wrapSource);
    }

    return fs;
  }

  /**
   * The archive directories and pack tables as plain data. Passed to `open` as `layout`
   * with the same files, it mounts them again without reading any directory.
   */
  layout(): MountLayout {
    return {
      version: this.version,
      archives: this.mountedArchives.map(({ path, archive }) => ({ path, ...archive.layout() })),
      packs: this.mountedPacks.map(({ path, pack }) => ({ path, ...pack.layout() })),
      warnings: [...this.warnings],
      unsupported: [...this.unsupported],
    };
  }

  private restore(files: DataFile[], layout: MountLayout, wrapSource: (source: ByteSource) => ByteSource): void {
    const sources = new Map(files.map((f) => [f.path, f.source]));

    const source = (path: string) => {
      const found = sources.get(path);

      if (!found) {
        throw new Error(`${path}: in the layout but not among the files`);
      }

      return wrapSource(found);
    };

    for (const a of layout.archives) {
      this.mount(a.path, WzArchive.restore(source(a.path), a));
    }

    this.version = layout.version;

    for (const p of layout.packs) {
      this.addPack(p.path, MsPack.restore(source(p.path), p));
    }

    // The layout's warnings already include those that mounting it again repeats.
    this.warnings.splice(0, this.warnings.length, ...layout.warnings);
    this.unsupported.push(...layout.unsupported);
  }

  // ---- lookup ------------------------------------------------------------------------

  /** Names of the mounted top-level trees (Character, Map, String, ...). */
  trees(): string[] {
    return [...this.root.dirs.keys()].sort();
  }

  /** A directory or image by path, without loading anything. */
  entry(path: string): WzDirectory | WzImage | undefined {
    let dir = this.root;
    const parts = splitPath(path);

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const sub = dir.dirs.get(part);

      if (sub) {
        dir = sub;

        continue;
      }

      const image = dir.images.get(part);

      return image && i === parts.length - 1 ? image : undefined;
    }

    return dir;
  }

  image(path: string): WzImage | undefined {
    const e = this.entry(path);

    return e instanceof WzImage ? e : undefined;
  }

  /**
   * Resolves a full node path such as `String/Mob.img/100100/name`, loading the image
   * if needed. An image path alone returns the image's root node.
   */
  async get(path: string): Promise<WzNode | undefined> {
    const split = this.splitAtImage(path);

    if (!split) {
      return undefined;
    }

    const root = await split.image.load();

    return split.rest ? root.get(split.rest) : root;
  }

  /**
   * The canvas that actually holds a node's pixels.
   *
   * Canvases in main images are usually 1x1 placeholders with an `_outlink` string: the
   * tree path of the real canvas (in a `_Canvas` archive). `_inlink` is the same idea
   * within one image. The node's own properties (origin, delay, z, ...) stay authoritative;
   * only the pixel description comes from the target.
   */
  async resolveCanvas(node: WzNode): Promise<{ canvas: CanvasData; via: string | null } | undefined> {
    let current = node.resolve();
    let via: string | null = null;

    for (let hop = 0; current && hop < 8; hop++) {
      if (current.kind !== "canvas") {
        return undefined;
      }

      const outlink = current.child("_outlink");
      const inlink = current.child("_inlink");

      if (outlink?.kind === "string") {
        via = outlink.value as string;
        current = await this.get(via);

        continue;
      }

      if (inlink?.kind === "string") {
        via = `${current.owner.path}/${inlink.value as string}`;
        current = current.root.get(inlink.value as string);

        continue;
      }

      return { canvas: current.value as CanvasData, via };
    }

    return undefined;
  }

  readPayload(canvas: CanvasData): Promise<Uint8Array> {
    return canvas.source.readRange(canvas.dataOffset, canvas.dataLength);
  }

  /** Splits a node path into its image and the in-image remainder. */
  splitAtImage(path: string): { image: WzImage; rest: string } | undefined {
    let dir = this.root;
    const parts = path.split("/");

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      if (part === "" || part === ".") {
        continue;
      }

      const image = dir.images.get(part);

      // Inside the image `.` can be a real node name (the decimal point glyph), so the
      // remainder goes to the node walk untouched.
      if (image) {
        return { image, rest: parts.slice(i + 1).join("/") };
      }

      const sub = dir.dirs.get(part);

      if (!sub) {
        return undefined;
      }

      dir = sub;
    }

    return undefined;
  }

  /** All images under a directory, recursively. */
  *imagesUnder(path: string): Generator<WzImage> {
    const start = this.entry(path);

    if (!(start instanceof WzDirectory)) {
      return;
    }

    const stack = [start];

    while (stack.length > 0) {
      const dir = stack.pop()!;

      yield* [...dir.images.values()].sort(byName);
      stack.push(...[...dir.dirs.values()].sort(byName).reverse());
    }
  }

  // ---- image cache -------------------------------------------------------------------

  /** Marks an image as recently used and drops the oldest when over budget. */
  touch(image: WzImage): void {
    this.loaded.delete(image);
    this.loaded.add(image);

    while (this.loaded.size > this.maxLoaded) {
      const oldest = this.loaded.values().next().value as WzImage;

      this.loaded.delete(oldest);
      oldest.unload();
    }
  }

  // ---- mounting ----------------------------------------------------------------------

  private mount(filePath: string, archive: WzArchive): void {
    const folder = parentPath(filePath);
    const fileName = filePath.slice(folder.length ? folder.length + 1 : 0);
    const base = fileName.replace(/(_\d+)?\.wz$/i, "");

    if (base !== lastSegment(folder)) {
      this.warnings.push(`${filePath}: archive name doesn't match its folder`);
    }

    this.archives.push({
      path: filePath,
      size: archive.source.size,
      version: archive.version,
      images: [...archive.images()].length,
      kind: "wz",
    });

    this.mountedArchives.push({ path: filePath, archive });

    this.mergeEntries(this.ensureDir(folder), archive.root, filePath);
  }

  /** Opens a pack file and mounts it; one that can't be opened is reported, not fatal. */
  private async mountPack(file: DataFile, wrapSource: (source: ByteSource) => ByteSource): Promise<void> {
    const source = wrapSource(file.source);
    const fileName = lastSegment(file.path);
    let pack: MsPack;

    try {
      pack = await MsPack.open(source, fileName);
    } catch (error) {
      this.unsupported.push(file.path);
      this.warnings.push(fileProblem(file.path, error));

      return;
    }

    this.addPack(file.path, pack);
  }

  /** Mounts each pack image at the tree path its entry names. */
  private addPack(path: string, pack: MsPack): void {
    for (const entry of pack.entries) {
      if (!entry.checksumOk) {
        this.warnings.push(`${path}: entry ${entry.name} has a bad checksum`);
      }

      // Packs can also carry plain files (e.g. `Skill/pack_ignore.txt`); they aren't images.
      if (!entry.name.toLowerCase().endsWith(".img")) {
        this.otherFiles.push({ path: entry.name, size: entry.size, container: path });

        continue;
      }

      const dir = this.ensureDir(parentPath(entry.name));
      const name = lastSegment(entry.name);

      if (dir.images.has(name)) {
        this.warnings.push(`${path}: duplicate image ${entry.name} (first kept)`);

        continue;
      }

      dir.images.set(name, new WzImage(name, joinPath(dir.path, name), pack.imageEntry(entry), this));
    }

    this.archives.push({
      path,
      size: pack.source.size,
      version: null,
      images: pack.entries.length,
      kind: "ms",
    });

    this.mountedPacks.push({ path, pack });
  }

  private mergeEntries(dir: WzDirectory, entries: ArchiveEntry[], filePath: string): void {
    for (const e of entries) {
      if (e.kind === "dir") {
        const sub = this.ensureDir(joinPath(dir.path, e.name));

        this.mergeEntries(sub, e.entries, filePath);

        continue;
      }

      if (dir.images.has(e.name)) {
        this.warnings.push(`${filePath}: duplicate image ${joinPath(dir.path, e.name)} (first kept)`);

        continue;
      }

      dir.images.set(e.name, new WzImage(e.name, joinPath(dir.path, e.name), e, this));
    }
  }

  private ensureDir(path: string): WzDirectory {
    let dir = this.root;

    for (const part of splitPath(path)) {
      let sub = dir.dirs.get(part);

      if (!sub) {
        sub = new WzDirectory(part, joinPath(dir.path, part));
        dir.dirs.set(part, sub);
      }

      dir = sub;
    }

    return dir;
  }

  /**
   * Checks each `X.ini`'s `LastWzIndex|N` against the `X_NNN.wz` files present, and a
   * `Packs/Packs.ini` (lines such as `Mob|3`) against the `Mob_NNNNN.ms` packs present.
   */
  private async checkIniFiles(iniFiles: DataFile[], dataFiles: DataFile[]): Promise<void> {
    for (const ini of iniFiles) {
      const bytes = await ini.source.readRange(0, Math.min(ini.source.size, 4096));
      const text = new TextDecoder().decode(bytes);
      const entries = [...text.matchAll(/^\s*([A-Za-z]\w*)\|(-?\d+)\s*$/gm)];

      if (entries.length === 0) {
        this.warnings.push(`${ini.path}: no LastWzIndex entry`);

        continue;
      }

      for (const [, key, value] of entries) {
        const last = Number(value);
        const isPack = key !== "LastWzIndex";
        const stem = isPack ? joinPath(parentPath(ini.path), key) : ini.path.replace(/\.ini$/i, "");
        const pattern = new RegExp(`^${escapeRegExp(stem)}_\\d+\\.${isPack ? "ms" : "wz"}$`, "i");
        const parts = dataFiles.filter((f) => pattern.test(f.path));

        if (parts.length !== last + 1) {
          this.warnings.push(`${ini.path}: ${key} ${last} but ${parts.length} part file(s) present`);
        }
      }
    }
  }
}

// ---- helpers -------------------------------------------------------------------------

/** `path: message`, without repeating the path when the message already starts with it. */
function fileProblem(path: string, error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);

  return message.startsWith(path) ? message : `${path}: ${message}`;
}

function splitPath(path: string): string[] {
  return path.split("/").filter((p) => p !== "" && p !== ".");
}

function joinPath(a: string, b: string): string {
  return a ? `${a}/${b}` : b;
}

function parentPath(path: string): string {
  const i = path.lastIndexOf("/");

  return i < 0 ? "" : path.slice(0, i);
}

function lastSegment(path: string): string {
  return path.slice(path.lastIndexOf("/") + 1);
}

/** One shared collator: `localeCompare` with options builds a new one on every call. */
const NAME_ORDER = new Intl.Collator("en", { numeric: true });

function byName(a: { name: string }, b: { name: string }): number {
  return NAME_ORDER.compare(a.name, b.name);
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function mostCommon(values: (number | null)[]): number | null {
  const counts = new Map<number, number>();

  for (const v of values) {
    if (v !== null) {
      counts.set(v, (counts.get(v) ?? 0) + 1);
    }
  }

  let best: number | null = null;
  let bestCount = 0;

  for (const [v, c] of counts) {
    if (c > bestCount) {
      best = v;
      bestCount = c;
    }
  }

  return best;
}
