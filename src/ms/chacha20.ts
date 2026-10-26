/**
 * ChaCha20 (RFC 8439 state layout, 20 rounds) for the `.ms` pack format.
 * See docs/wz-format.md, ".ms packs".
 */

const CONSTANTS = [0x61707865, 0x3320646e, 0x79622d32, 0x6b206574]; // "expand 32-byte k"

export const KEY_LENGTH = 32;
export const NONCE_LENGTH = 12;
export const BLOCK_LENGTH = 64;

function rotl(x: number, n: number): number {
  return ((x << n) | (x >>> (32 - n))) >>> 0;
}

function quarterRound(s: Uint32Array, a: number, b: number, c: number, d: number): void {
  s[a] = (s[a] + s[b]) >>> 0;
  s[d] = rotl(s[d] ^ s[a], 16);

  s[c] = (s[c] + s[d]) >>> 0;
  s[b] = rotl(s[b] ^ s[c], 12);

  s[a] = (s[a] + s[b]) >>> 0;
  s[d] = rotl(s[d] ^ s[a], 8);

  s[c] = (s[c] + s[d]) >>> 0;
  s[b] = rotl(s[b] ^ s[c], 7);
}

/** A ChaCha20 keystream generator. Call `next()` for successive 64-byte blocks. */
export class ChaCha20 {
  /** Input state; word 12 is the block counter. */
  readonly state = new Uint32Array(16);

  private readonly work = new Uint32Array(16);

  constructor(key: Uint8Array, nonce: Uint8Array, counter: number) {
    if (key.length !== KEY_LENGTH) {
      throw new RangeError(`ChaCha20 key must be ${KEY_LENGTH} bytes`);
    }

    if (nonce.length !== NONCE_LENGTH) {
      throw new RangeError(`ChaCha20 nonce must be ${NONCE_LENGTH} bytes`);
    }

    const keyView = new DataView(key.buffer, key.byteOffset, key.byteLength);
    const nonceView = new DataView(nonce.buffer, nonce.byteOffset, nonce.byteLength);

    this.state.set(CONSTANTS, 0);

    for (let i = 0; i < 8; i++) {
      this.state[4 + i] = keyView.getUint32(i * 4, true);
    }

    this.state[12] = counter >>> 0;

    for (let i = 0; i < 3; i++) {
      this.state[13 + i] = nonceView.getUint32(i * 4, true);
    }
  }

  /** Produces the next 64-byte keystream block and advances the counter. */
  next(out = new Uint8Array(BLOCK_LENGTH)): Uint8Array {
    const s = this.state;
    const x = this.work;

    x.set(s);

    for (let round = 0; round < 10; round++) {
      // Column round.
      quarterRound(x, 0, 4, 8, 12);
      quarterRound(x, 1, 5, 9, 13);
      quarterRound(x, 2, 6, 10, 14);
      quarterRound(x, 3, 7, 11, 15);

      // Diagonal round.
      quarterRound(x, 0, 5, 10, 15);
      quarterRound(x, 1, 6, 11, 12);
      quarterRound(x, 2, 7, 8, 13);
      quarterRound(x, 3, 4, 9, 14);
    }

    const view = new DataView(out.buffer, out.byteOffset, out.byteLength);

    for (let i = 0; i < 16; i++) {
      view.setUint32(i * 4, (x[i] + s[i]) >>> 0, true);
    }

    // The counter carries into word 13 when it wraps.
    s[12] = (s[12] + 1) >>> 0;

    if (s[12] === 0) {
      s[13] = (s[13] + 1) >>> 0;
    }

    return out;
  }

  /** XORs `data` with the keystream in place, starting at the current counter. */
  xor(data: Uint8Array): Uint8Array {
    const block = new Uint8Array(BLOCK_LENGTH);

    for (let at = 0; at < data.length; at += BLOCK_LENGTH) {
      this.next(block);

      const end = Math.min(data.length, at + BLOCK_LENGTH);

      for (let i = at; i < end; i++) {
        data[i] ^= block[i - at];
      }
    }

    return data;
  }
}

/**
 * Decrypts a stream field by field, reproducing the `.ms` entry-table quirk: whenever a
 * field read ends exactly at the end of a 64-byte keystream block, the block counter is
 * reset to 0, so the following block reuses counter 0.
 */
export class FieldDecryptor {
  private readonly cipher: ChaCha20;
  private readonly block = new Uint8Array(BLOCK_LENGTH);

  /** Bytes of the current keystream block already used; 64 means "need a new block". */
  private used = BLOCK_LENGTH;

  /** Position in `encrypted` of the next ciphertext byte. */
  pos = 0;

  constructor(
    private readonly encrypted: Uint8Array,
    key: Uint8Array,
    nonce: Uint8Array,
  ) {
    this.cipher = new ChaCha20(key, nonce, 0);
  }

  /** Decrypts the next `n` bytes as one field read. */
  read(n: number): Uint8Array {
    const out = new Uint8Array(n);

    for (let i = 0; i < n; i++) {
      if (this.used === BLOCK_LENGTH) {
        this.cipher.next(this.block);
        this.used = 0;
      }

      if (this.pos >= this.encrypted.length) {
        throw new RangeError("entry table runs past the data read for it");
      }

      out[i] = this.encrypted[this.pos++] ^ this.block[this.used++];
    }

    if (this.used === BLOCK_LENGTH) {
      this.cipher.state[12] = 0;
    }

    return out;
  }

  i32(): number {
    const b = this.read(4);

    return new DataView(b.buffer).getInt32(0, true);
  }

  /** `i32 length`, then that many UTF-16LE code units (read as one field). */
  utf16(): string {
    const units = this.i32();

    if (units < 0 || units > 4096) {
      throw new RangeError(`implausible entry name length ${units}`);
    }

    const b = this.read(units * 2);
    let text = "";

    for (let i = 0; i < units; i++) {
      text += String.fromCharCode(b[i * 2] | (b[i * 2 + 1] << 8));
    }

    return text;
  }
}
