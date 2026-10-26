/**
 * Node `fs` source — for tools and tests only; app code never imports it.
 * Files are always opened read-only (flag "r").
 */
import { open, type FileHandle } from "node:fs/promises";

import type { ByteSource } from "../source.ts";

export class NodeFileSource implements ByteSource {
  private constructor(
    readonly name: string,
    readonly size: number,
    private readonly handle: FileHandle,
  ) {}

  static async open(path: string, name = path): Promise<NodeFileSource> {
    const handle = await open(path, "r");
    const stats = await handle.stat();

    return new NodeFileSource(name, stats.size, handle);
  }

  async readRange(offset: number, length: number): Promise<Uint8Array> {
    const wanted = Math.max(0, Math.min(length, this.size - offset));
    const buffer = new Uint8Array(wanted);
    let done = 0;

    while (done < wanted) {
      const { bytesRead } = await this.handle.read(buffer, done, wanted - done, offset + done);

      if (bytesRead === 0) {
        break;
      }

      done += bytesRead;
    }

    return done === wanted ? buffer : buffer.subarray(0, done);
  }

  close(): Promise<void> {
    return this.handle.close();
  }
}
