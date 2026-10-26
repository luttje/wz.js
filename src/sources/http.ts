/**
 * Dev-only source that reads through the Vite dev server's game-data route with HTTP
 * Range requests. Only the `?dev=1` code path uses it; production builds never reach it.
 */
import type { ByteSource } from "../source.ts";

export class HttpRangeSource implements ByteSource {
  constructor(
    readonly name: string,
    readonly size: number,
    private readonly url: string,
  ) {}

  async readRange(offset: number, length: number): Promise<Uint8Array> {
    const end = Math.min(this.size, offset + length);

    if (end <= offset) {
      return new Uint8Array(0);
    }

    const response = await fetch(this.url, {
      headers: { Range: `bytes=${offset}-${end - 1}` },
    });

    if (response.status !== 206 && response.status !== 200) {
      throw new Error(`${this.url}: HTTP ${response.status}`);
    }

    const bytes = new Uint8Array(await response.arrayBuffer());

    // A server that ignores Range answers 200 with the whole file.
    if (response.status === 200) {
      return bytes.subarray(offset, end);
    }

    return bytes;
  }
}
