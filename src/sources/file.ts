/**
 * Browser `File` / `Blob` source. Reads with `slice().arrayBuffer()`, never the whole file.
 */
import type { ByteSource } from "../source.ts";

export class BlobSource implements ByteSource {
  readonly size: number;

  constructor(
    readonly name: string,
    private readonly blob: Blob,
  ) {
    this.size = blob.size;
  }

  async readRange(offset: number, length: number): Promise<Uint8Array> {
    const end = Math.min(this.size, offset + length);
    const buffer = await this.blob.slice(offset, end).arrayBuffer();

    return new Uint8Array(buffer);
  }
}
