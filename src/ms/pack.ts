/**
 * `.ms` pack reader (pack layout version 4). See docs/wz-format.md, ".ms packs".
 *
 * A pack holds ordinary `.img` images. Only the first 1024 bytes of each image are
 * encrypted, so `MsEntrySource` decrypts that prefix once and passes every other read
 * straight through to the pack file.
 */
import type { ImageContainer, ImageEntry } from "../archive.ts";
import type { ByteSource } from "../source.ts";
import { ChaCha20, FieldDecryptor, KEY_LENGTH, NONCE_LENGTH } from "./chacha20.ts";

export const SUPPORTED_PACK_VERSION = 4;

/** Bytes at the start of each entry that are encrypted. */
const ENCRYPTED_PREFIX = 1024;

/** Entry data is aligned to this many bytes. */
const DATA_ALIGNMENT = 1024;

/** XORed into every derived 32-byte key. */
const KEY_MASK = Uint8Array.of(
  0x7b, 0x2f, 0x35, 0x48, 0x43, 0x95, 0x02, 0xb9, 0xae, 0x91, 0xa6, 0xe1, 0xd8, 0xd6, 0x24, 0xb4,
  0x33, 0x10, 0x1d, 0x3d, 0xc1, 0xbb, 0xc6, 0xf4, 0xa5, 0xfe, 0xb3, 0x69, 0x6b, 0x56, 0xe4, 0x75,
);

export class MsFormatError extends Error {}

export interface MsHeader {
  /** Lower-cased file name the keys are derived from, e.g. `mob_00000.ms`. */
  fileName: string;
  version: number;
  salt: string;
  entryCount: number;
  entryTableOffset: number;
  dataStart: number;
}

export interface MsEntry {
  /** Image path inside the pack, `/`-separated. */
  name: string;
  checksum: number;
  flags: number;
  /** Absolute file offset of the entry's data. */
  offset: number;
  size: number;
  sizeAligned: number;
  key: Uint8Array;
  unknown: [number, number, number, number];
  /** True when `checksum` matches the sum of the other fields. */
  checksumOk: boolean;
}

/** An opened pack's header and entry table as plain data. */
export interface PackLayout {
  header: MsHeader;
  entries: MsEntry[];
}

export class MsPack {
  private constructor(
    readonly source: ByteSource,
    readonly header: MsHeader,
    readonly entries: MsEntry[],
  ) {}

  get name(): string {
    return this.source.name;
  }

  /**
   * Opens a pack.
   *
   * @param fileName the pack's own file name (keys are derived from it), e.g. `Mob_00000.ms`
   */
  static async open(source: ByteSource, fileName: string): Promise<MsPack> {
    const header = await readHeader(source, fileName.toLowerCase());
    const { entries, dataStart } = await readEntries(source, header);

    header.dataStart = dataStart;

    return new MsPack(source, header, entries);
  }

  /** Reopens a pack from an earlier `layout()` of the same file without reading anything. */
  static restore(source: ByteSource, layout: PackLayout): MsPack {
    return new MsPack(source, layout.header, layout.entries);
  }

  /** The header and entry table as plain data, for `restore`. */
  layout(): PackLayout {
    return { header: this.header, entries: this.entries };
  }

  /** An image entry whose bytes are decrypted on the fly, for the image parser. */
  imageEntry(entry: MsEntry): ImageEntry {
    const container: ImageContainer = {
      name: `${this.name}:${entry.name}`,
      source: new MsEntrySource(this, entry),
    };

    return {
      kind: "img",
      name: entry.name.slice(entry.name.lastIndexOf("/") + 1),
      archive: container,
      size: entry.size,
      checksum: entry.checksum,
      offset: 0,
    };
  }
}

// ---- header --------------------------------------------------------------------------

async function readHeader(source: ByteSource, fileName: string): Promise<MsHeader> {
  const prefixLength = (sumUnits(fileName) % 312) + 30;

  // Enough for the prefix, version, salt length and a generous salt.
  const bytes = await source.readRange(0, prefixLength + 5 + 2 * 256 + 8);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  // Each random-prefix byte is unscrambled as an arithmetic shift of a signed byte.
  const r = new Uint8Array(prefixLength);

  for (let i = 0; i < prefixLength; i++) {
    r[i] = ((bytes[i] << 24) >> 25) & 0xff;
  }

  let pos = prefixLength;

  const storedVersion = bytes[pos];
  const version = storedVersion ^ r[0];

  pos += 1;

  if (version !== SUPPORTED_PACK_VERSION) {
    throw new MsFormatError(`${source.name}: pack version ${version}, expected ${SUPPORTED_PACK_VERSION}`);
  }

  const storedSaltLength = view.getInt32(pos, true);
  const saltLength = (storedSaltLength & 0xff) ^ r[0];

  pos += 4;

  let salt = "";
  let saltUnitSum = 0;

  for (let i = 0; i < saltLength; i++) {
    const unit = view.getUint16(pos + i * 2, true);
    const a = r[i] ^ (unit & 0xff);

    salt += String.fromCharCode(((a | 0x4b) << 1) - a - 75);
    saltUnitSum = (saltUnitSum + unit) | 0;
  }

  pos += saltLength * 2;

  const headerStart = pos;
  const keyText = fileName + salt;

  const encrypted = bytes.slice(headerStart, headerStart + 8);
  const plain = new ChaCha20(headerKey(keyText), new Uint8Array(NONCE_LENGTH), 0).xor(encrypted);
  const plainView = new DataView(plain.buffer);

  const hash = plainView.getInt32(0, true);
  const entryCount = plainView.getInt32(4, true);
  const expectedHash = (storedSaltLength + storedVersion + version + entryCount + saltUnitSum) | 0;

  if (hash !== expectedHash) {
    throw new MsFormatError(`${source.name}: header check failed (wrong file name or unsupported pack)`);
  }

  const entryTableOffset = headerStart + 8 + (sumUnits(fileName, 3) % 212) + 64;

  return { fileName, version, salt, entryCount, entryTableOffset, dataStart: 0 };
}

/** `K1[i] = byte(text[i % len] + i) ^ mask[i]` */
function headerKey(text: string): Uint8Array {
  const key = new Uint8Array(KEY_LENGTH);

  for (let i = 0; i < KEY_LENGTH; i++) {
    key[i] = ((text.charCodeAt(i % text.length) + i) & 0xff) ^ KEY_MASK[i];
  }

  return key;
}

// ---- entry table ---------------------------------------------------------------------

async function readEntries(source: ByteSource, header: MsHeader): Promise<{ entries: MsEntry[]; dataStart: number }> {
  const keyText = header.fileName + header.salt;
  const key = tableKey(keyText);

  // An entry is ~60 bytes plus its name; read generously and grow if needed.
  let window = Math.max(64 * 1024, header.entryCount * 256);

  for (;;) {
    const bytes = await source.readRange(header.entryTableOffset, window);
    const reader = new FieldDecryptor(bytes, key, new Uint8Array(NONCE_LENGTH));

    try {
      const entries: MsEntry[] = [];

      for (let i = 0; i < header.entryCount; i++) {
        entries.push(readEntry(reader));
      }

      const tableEnd = header.entryTableOffset + reader.pos;
      const dataStart = Math.ceil(tableEnd / DATA_ALIGNMENT) * DATA_ALIGNMENT;

      for (const e of entries) {
        e.offset = dataStart + e.offset * DATA_ALIGNMENT;
      }

      return { entries, dataStart };
    } catch (error) {
      const canGrow = header.entryTableOffset + bytes.length < source.size && bytes.length === window;

      if (!(error instanceof RangeError) || !canGrow) {
        throw error;
      }

      window *= 4;
    }
  }
}

function readEntry(reader: FieldDecryptor): MsEntry {
  const name = reader.utf16();
  const checksum = reader.i32();
  const flags = reader.i32();
  const startBlock = reader.i32();
  const size = reader.i32();
  const sizeAligned = reader.i32();
  const unk1 = reader.i32();
  const unk2 = reader.i32();
  const key = reader.read(16);
  const unk3 = reader.i32();
  const unk4 = reader.i32();

  const keySum = key.reduce((sum, b) => sum + b, 0);
  const computed = (flags + startBlock + size + sizeAligned + unk1 + keySum) | 0;

  return {
    name,
    checksum,
    flags,
    // Converted to an absolute offset once the data start is known.
    offset: startBlock,
    size,
    sizeAligned,
    key,
    unknown: [unk1, unk2, unk3, unk4],
    checksumOk: computed === checksum,
  };
}

/** `K2[i] = byte(i + (i % 3 + 2) * text[len - 1 - (i % len)]) ^ mask[i]` */
function tableKey(text: string): Uint8Array {
  const key = new Uint8Array(KEY_LENGTH);
  const len = text.length;

  for (let i = 0; i < KEY_LENGTH; i++) {
    const c = text.charCodeAt(len - 1 - (i % len));

    key[i] = ((i + (i % 3 + 2) * c) & 0xff) ^ KEY_MASK[i];
  }

  return key;
}

// ---- entry data ----------------------------------------------------------------------

/** Key, nonce and counter for decrypting one entry's first 1024 bytes. */
function entryCipher(salt: string, entry: MsEntry): ChaCha20 {
  // FNV-1a over the salt's UTF-16 units.
  let h = 0x811c9dc5;

  for (let i = 0; i < salt.length; i++) {
    h = Math.imul(h ^ salt.charCodeAt(i), 0x01000193) >>> 0;
  }

  const h2 = h >>> 1;
  const h3 = (h2 ^ 0x6c) >>> 0;
  const digits = [...String(h)].map((d) => d.charCodeAt(0) - 48);
  const D = digits.length;
  const name = entry.name;
  const k = entry.key;

  const key = new Uint8Array(KEY_LENGTH);

  for (let i = 0; i < KEY_LENGTH; i++) {
    const factor = (digits[i % D] % 2) + k[(digits[(i + 2) % D] + i) % 16] + ((digits[(i + 1) % D] + i) % 5);
    const value = i + name.charCodeAt(i % name.length) * factor;

    key[i] = (value & 0xff) ^ KEY_MASK[i];
  }

  const t = new Uint8Array(12);
  const tView = new DataView(t.buffer);

  tView.setUint32(0, h, true);
  tView.setUint32(4, h2, true);
  tView.setUint32(8, h3, true);

  for (let i = 0; i < 12; i++) {
    const a = 8 * i;
    const b = 17 * i;
    const c = 90 + 43 * i;
    const d = -i;

    t[i] ^= (d + 11 * Math.floor(i / 11) + (c ^ (i >> 2)) + (a ^ b)) & 0xff;
  }

  const nonce = new Uint8Array(NONCE_LENGTH);

  nonce.set(t.subarray(0, 8), 4);

  return new ChaCha20(key, nonce, tView.getUint32(8, true));
}

/**
 * The decrypted bytes of one entry, addressed from 0. The encrypted prefix is decrypted
 * on first use and kept; the remainder is read straight from the pack.
 */
export class MsEntrySource implements ByteSource {
  readonly name: string;
  readonly size: number;

  private prefix: Promise<Uint8Array> | null = null;

  constructor(
    private readonly pack: MsPack,
    private readonly entry: MsEntry,
  ) {
    this.name = `${pack.name}:${entry.name}`;
    this.size = entry.size;
  }

  async readRange(offset: number, length: number): Promise<Uint8Array> {
    const end = Math.min(this.size, offset + length);

    if (end <= offset) {
      return new Uint8Array(0);
    }

    const prefixLength = Math.min(this.size, ENCRYPTED_PREFIX);

    // Entirely in the clear part.
    if (offset >= prefixLength) {
      return this.pack.source.readRange(this.entry.offset + offset, end - offset);
    }

    const prefix = await this.decryptedPrefix();

    // Entirely inside the decrypted prefix.
    if (end <= prefixLength) {
      return prefix.subarray(offset, end);
    }

    // Spans both parts.
    const rest = await this.pack.source.readRange(this.entry.offset + prefixLength, end - prefixLength);
    const out = new Uint8Array(end - offset);

    out.set(prefix.subarray(offset), 0);
    out.set(rest, prefixLength - offset);

    return out;
  }

  private decryptedPrefix(): Promise<Uint8Array> {
    if (!this.prefix) {
      const length = Math.min(this.size, ENCRYPTED_PREFIX);

      this.prefix = this.pack.source.readRange(this.entry.offset, length).then((bytes) => {
        const copy = bytes.slice();

        return entryCipher(this.pack.header.salt, this.entry).xor(copy);
      });
    }

    return this.prefix;
  }
}

function sumUnits(text: string, factor = 1): number {
  let sum = 0;

  for (let i = 0; i < text.length; i++) {
    sum += text.charCodeAt(i) * factor;
  }

  return sum;
}
