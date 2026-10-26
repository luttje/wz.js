/**
 * Random-access byte sources.
 *
 * Every reader in this package reads archives through `ByteSource`, so the same reader runs
 * against a browser `File`, a dev-only HTTP Range endpoint, or Node's `fs`.
 */

export interface ByteSource {
  /** Display name, usually the archive's relative path (e.g. `Npc/Npc_000.wz`). */
  readonly name: string;

  /** Total size in bytes. */
  readonly size: number;

  /** Reads `length` bytes at `offset`. May return fewer bytes only at end of file. */
  readRange(offset: number, length: number): Promise<Uint8Array>;
}

export const BLOCK_SIZE = 64 * 1024;

/** Reads larger than this bypass the block cache so one big canvas doesn't evict everything. */
const DIRECT_READ_THRESHOLD = BLOCK_SIZE * 4;

/**
 * Block read-ahead cache: rounds reads to 64 KB blocks and keeps the most recently
 * used blocks (LRU). Concurrent reads of the same block share one request.
 */
export class CachedSource implements ByteSource {
  readonly name: string;
  readonly size: number;

  /** Loaded blocks in LRU order: the first key is the least recently used. */
  private readonly blocks = new Map<number, Uint8Array>();

  /** In-flight block reads, so concurrent requests for one block share a read. */
  private readonly pending = new Map<number, Promise<Uint8Array>>();

  constructor(
    private readonly inner: ByteSource,
    private readonly maxBlocks = 256,
  ) {
    this.name = inner.name;
    this.size = inner.size;
  }

  async readRange(offset: number, length: number): Promise<Uint8Array> {
    if (offset < 0 || length < 0) {
      throw new RangeError(`bad range ${offset}+${length}`);
    }

    const end = Math.min(this.size, offset + length);

    if (end <= offset) {
      return new Uint8Array(0);
    }

    if (end - offset > DIRECT_READ_THRESHOLD) {
      return this.inner.readRange(offset, end - offset);
    }

    const first = Math.floor(offset / BLOCK_SIZE);
    const last = Math.floor((end - 1) / BLOCK_SIZE);

    // Fast path: the range lies inside one block, so return a view without copying.
    if (first === last) {
      const block = await this.block(first);
      const start = offset - first * BLOCK_SIZE;

      return block.subarray(start, start + (end - offset));
    }

    const requests: Promise<Uint8Array>[] = [];

    for (let i = first; i <= last; i++) {
      requests.push(this.block(i));
    }

    const blocks = await Promise.all(requests);
    const out = new Uint8Array(end - offset);

    for (let i = first; i <= last; i++) {
      const block = blocks[i - first];
      const blockStart = i * BLOCK_SIZE;

      const from = Math.max(offset, blockStart);
      const to = Math.min(end, blockStart + block.length);

      out.set(block.subarray(from - blockStart, to - blockStart), from - offset);
    }

    return out;
  }

  private block(index: number): Promise<Uint8Array> {
    const hit = this.blocks.get(index);

    if (hit) {
      // Re-insert to mark as most recently used.
      this.blocks.delete(index);
      this.blocks.set(index, hit);

      return Promise.resolve(hit);
    }

    const inFlight = this.pending.get(index);

    if (inFlight) {
      return inFlight;
    }

    const start = index * BLOCK_SIZE;
    const length = Math.min(BLOCK_SIZE, this.size - start);

    const request = this.inner.readRange(start, length).then(
      (bytes) => {
        this.pending.delete(index);
        this.store(index, bytes);

        return bytes;
      },
      (error: unknown) => {
        this.pending.delete(index);

        throw error;
      },
    );

    this.pending.set(index, request);

    return request;
  }

  private store(index: number, bytes: Uint8Array): void {
    this.blocks.set(index, bytes);

    if (this.blocks.size > this.maxBlocks) {
      const oldest = this.blocks.keys().next().value as number;

      this.blocks.delete(oldest);
    }
  }
}

/** A source over an in-memory buffer (tests, small files). */
export class MemorySource implements ByteSource {
  readonly size: number;

  constructor(
    readonly name: string,
    private readonly bytes: Uint8Array,
  ) {
    this.size = bytes.length;
  }

  async readRange(offset: number, length: number): Promise<Uint8Array> {
    const end = Math.min(this.size, offset + length);

    return this.bytes.subarray(offset, end);
  }
}
