/**
 * WZ offset and string obfuscation. All arithmetic is unsigned 32-bit.
 *
 * Classic World uses a zero string key, so strings carry only the positional XOR mask
 * (no AES keystream). See docs/wz-format.md.
 */

export const OFFSET_CONSTANT = 0x581c3f6d;

/** Rotate a 32-bit value left by `n & 31` bits. */
export function rotl32(x: number, n: number): number {
  const shift = n & 31;
  const value = x >>> 0;

  if (shift === 0) {
    return value;
  }

  return ((value << shift) | (value >>> (32 - shift))) >>> 0;
}

/** Version hash: for each decimal digit character c, `h = h * 32 + c + 1` (mod 2^32). */
export function versionHash(version: number): number {
  let hash = 0;

  for (const ch of String(version)) {
    hash = (Math.imul(hash, 32) + ch.charCodeAt(0) + 1) >>> 0;
  }

  return hash;
}

/** The 16-bit value stored in the archive header: `0xFF ^ b3 ^ b2 ^ b1 ^ b0` of the hash. */
export function encVerOf(hash: number): number {
  const b3 = hash >>> 24;
  const b2 = (hash >>> 16) & 0xff;
  const b1 = (hash >>> 8) & 0xff;
  const b0 = hash & 0xff;

  return (0xff ^ b3 ^ b2 ^ b1 ^ b0) & 0xff;
}

/**
 * Decrypts a directory entry offset.
 *
 * @param pos file position of the 4-byte encrypted offset field
 * @param encrypted the stored u32
 * @param fstart offset of the archive's content section
 * @param hash version hash from `versionHash`
 */
export function decryptOffset(pos: number, encrypted: number, fstart: number, hash: number): number {
  let o = ((pos - fstart) ^ 0xffffffff) >>> 0;

  o = Math.imul(o, hash) >>> 0;
  o = (o - OFFSET_CONSTANT) >>> 0;
  o = rotl32(o, o & 0x1f);
  o = (o ^ encrypted) >>> 0;
  o = (o + fstart * 2) >>> 0;

  return o;
}

/** Unmasks an ASCII string: `byte[k] ^= (0xAA + k) & 0xFF`. */
export function decodeAscii(bytes: Uint8Array): string {
  let text = "";
  let mask = 0xaa;

  for (let k = 0; k < bytes.length; k++) {
    text += String.fromCharCode((bytes[k] ^ mask) & 0xff);
    mask = (mask + 1) & 0xff;
  }

  return text;
}

/** Unmasks a UTF-16LE string: `u16[k] ^= (0xAAAA + k) & 0xFFFF`. */
export function decodeUtf16(bytes: Uint8Array, units: number): string {
  const codes = new Array<number>(units);
  let mask = 0xaaaa;

  for (let k = 0; k < units; k++) {
    const unit = bytes[2 * k] | (bytes[2 * k + 1] << 8);

    codes[k] = unit ^ mask;
    mask = (mask + 1) & 0xffff;
  }

  // Convert in slices: spreading a very long array into fromCharCode overflows the stack.
  const SLICE = 4096;
  let text = "";

  for (let i = 0; i < codes.length; i += SLICE) {
    text += String.fromCharCode(...codes.slice(i, i + SLICE));
  }

  return text;
}
