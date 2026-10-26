# WZ format

The binary format of the PKG1 archives as verified against Classic World version 779. Every
statement here was confirmed by parsing **all 14,623 images** in the snapshot without a
single failure, unless it is marked `UNVERIFIED`. `npm run inventory` repeats that check
against your own install and reports the formats it saw.

All integers are little-endian.

## Primitive types

| Type | Encoding | Status |
|---|---|---|
| `cint` | `i8 b`; if `b == -128`, an `i32` follows; otherwise the value is `b`. | Confirmed |
| `clong` | As `cint`, but the escape reads an `i64`. Classic World's values fit in a JS safe integer; the current client also stores sentinels such as `999999999999999999`, which the property reader rounds to the nearest double. | Confirmed (154 uses) |
| encrypted string | `i8 len`. `len < 0`: ASCII of `-len` bytes (`len == -128`: `i32` length follows). `len > 0`: UTF-16LE of `len` units (`len == 127`: `i32` length follows). `len == 0`: empty. | Confirmed |
| ASCII mask | `byte[k] ^= (0xAA + k) & 0xFF` | Confirmed |
| UTF-16 mask | `unit[k] ^= (0xAAAA + k) & 0xFFFF` | Confirmed |

The string key is **zero**: no AES keystream is applied, only the positional masks.

## Archive header

```
u8[4]  magic      "PKG1"
u64    fsize      size of the data that follows the header
u32    fstart     offset of the content section (always 60 / 0x3C here)
cstr   copyright  "Package file v1.0 Copyright 2002 Wizet, ZMS", NUL-terminated
-- at fstart --
u16    encVer     34 for every archive
directory         (root directory)
```

## Directory

```
cint count
count × entry:
  u8 type
    1 -> 10 bytes follow (i32, i16, i32); no name, size or offset. Skip and continue.
    2 -> i32 off; the real type byte and name are at fstart + off.
    3 -> sub-directory; encrypted name follows
    4 -> image (.img); encrypted name follows
  cint size        (bytes of the image, or of the directory listing)
  cint checksum
  u32  encrypted offset
```

Types 1 and 2 never occur in Classic World archives (0 of each across all 178 archives).
Sub-directory listings live at their decrypted offset and are parsed recursively.

### Offset decryption

All arithmetic is unsigned 32-bit (`Math.imul`, `>>> 0`, explicit rotate):

```
hash = 0;  for each decimal digit character c of version: hash = hash*32 + c + 1
encVer check: 0xFF ^ b3 ^ b2 ^ b1 ^ b0 of hash   (must equal the header's encVer)

pos = file position of the encrypted offset field
o = (pos - fstart) ^ 0xFFFFFFFF
o = o * hash
o = o - 0x581C3F6D
o = rotl32(o, o & 0x1F)
o = o ^ encryptedOffset
o = o + fstart * 2
```

Version 779: hash `0x0000E73A`, encVer `34` — both confirmed.

### Version auto-detection

Try every version 1..2000 whose encVer check matches the header (about 8 candidates). Accept
the first where every directory offset falls inside the file and the images, sorted by
offset, neither overlap each other nor run past the end of the file. Every archive that
contains images detects **779**, and in every one the last image ends exactly at the file
length (including the known check: `String_000.wz` has 24 images, last one ending at
1,129,102 = file size).

Archives without images (stubs and empty `_Canvas.wz` files) can't be validated: any
candidate passes. Treat their version as unknown and use the one shared by the others.

## Image (`.img`) layout

An image starts with an extended object of type `Property`. Offsets inside an image are
relative to the image's first byte.

### String blocks

`u8 marker`, then:

| Marker | Meaning | Where it appears |
|---|---|---|
| `0x00` | inline encrypted string | property names, string values |
| `0x01` | `i32 off`; encrypted string at `imageStart + off` | property names, string values |
| `0x73` | inline encrypted string | extended-object type names |
| `0x1B` | `i32 off`; encrypted string at `imageStart + off` | extended-object type names |

The offset points **directly at the encrypted string** (no marker byte there). In practice
the reader accepts either marker pair in either position.

### Property list

```
u16  reserved (always 0)
cint count
count × { stringBlock name; u8 type; value }
```

| Type | Value | Status |
|---|---|---|
| `0x00` | none (null) | Confirmed |
| `0x02`, `0x0B` | `i16` | Confirmed |
| `0x03`, `0x13` | `cint` | Confirmed |
| `0x14` | `clong` | Confirmed |
| `0x04` | `u8 f`; if `f == 0x80` an `f32` follows, else the value is 0 | Confirmed |
| `0x05` | `f64` | Confirmed |
| `0x08` | string block | Confirmed |
| `0x09` | `u32 blockSize`, then an extended object; continue at block start + `blockSize` | Confirmed: every block's parse ends exactly at its declared end (except `RawData`, which is skipped) |

### Extended objects

The type name is a string block (markers `0x73`/`0x1B`).

| Name | Layout | Status |
|---|---|---|
| `Property` | property list | Confirmed |
| `Canvas` | `u8 0`, `u8 hasProps`; if 1 a property list; `cint width`, `cint height`, `cint format`, `u8 scale`, `i32 0`, `i32 dataLen`, `u8 0`, then `dataLen - 1` payload bytes | Confirmed; reserved fields always 0 |
| `Shape2D#Vector2D` | `cint x`, `cint y` | Confirmed |
| `Shape2D#Convex2D` | `cint count`, then `count` extended objects (always `Shape2D#Vector2D`) | Confirmed |
| `UOL` | `u8 0`, string block: a path relative to the UOL's parent | Confirmed |
| `Sound_DX8` | see below | Confirmed |
| `RawData` | **Not in the original description.** 8 occurrences, all in `Effect/lut.img` (colour lookup tables). Payload layout `UNVERIFIED`; the reader skips the block using `blockSize`. | Observed |

### Canvas payload

The payload is a **zlib stream** (`78 9C`) in every canvas sampled. The chunked alternative
(`i32 len` + bytes, repeated) is implemented but `UNVERIFIED`: no canvas used it.

**Quirk:** the zlib streams are **unterminated**: they stop at a sync-flush point, with no
final deflate block and no Adler-32 trailer, so every inflater reports "unexpected end of
file". Checked on 3,001 canvases: inflating the raw deflate data (skip the 2-byte zlib
header) with the two bytes `03 00` appended (an empty final fixed-Huffman block) completes
cleanly every time. Do this rather than keeping the output produced before the error:
browsers' `DecompressionStream` withholds its last output when it errors, which silently
cut off the bottom of large images (e.g. `Map/Back/back_grassySoil.img/back/1`).

Pixel formats (stored size is `width >> scale` × `height >> scale`; each stored pixel covers a
`2^scale` square):

| format | Layout | Decompressed size | Status |
|---|---|---|---|
| 1 | BGRA4444: byte0 = `G<<4 \| B`, byte1 = `A<<4 \| R` | 2 B/px | Confirmed visually (NPC, mob, tile sprites) |
| 2 | BGRA8888 | 4 B/px | Confirmed visually (item icon) |
| 513 | RGB565 | 2 B/px | Confirmed visually (UI text) |
| 513 + scale 4 | RGB565, 16×16 per stored pixel (what older tools call format **517**) | 2 B per stored px | Confirmed (`Map/Back/back_dryRock.img/back/0`: 256×256 from 16×16) |
| 1026 | DXT3 | 1 B/px | Not seen in this data |
| 2050 | DXT5 | 1 B/px | Confirmed visually (`Effect/_Canvas/footprint.img`) |
| 4098 | **Unknown.** 16-byte blocks per 4×4 pixels (decompressed size = w×h, padded to 4). Probably BC7 (`0x1000` + 2). | 1 B/px | `UNVERIFIED`; only in `Skill/_Canvas/800127.img` (6,666 canvases). Shown as a magenta placeholder. |

Format 1 accounts for 97% of all canvases.

### Sound_DX8

```
u8    0
cint  dataLen
cint  durationMs
82-byte media header:
  u8      0x02
  GUID    major type  {E436EB83-524F-11CE-9F53-0020AF0BA770}  MEDIATYPE_Stream
  GUID    subtype     {E436EB8B-524F-11CE-9F53-0020AF0BA770}  MEDIASUBTYPE_WAVE
  u8, u8  0x00, 0x01
  GUID    format type {05589F81-C356-11CE-BF01-00AA0055595A}  FORMAT_WaveFormatEx
  u8      30  (length of the WAVEFORMATEX that follows)
  30 B    MPEGLAYER3WAVEFORMAT, unobfuscated: wFormatTag 0x0055 (MP3), channels,
          sample rate (22050 seen), average bytes/s, block align 1, bits 0, cbSize 12,
          then wID 1, fdwFlags, nBlockSize, nFramesPerBlock 1, nCodecDelay
dataLen bytes of audio
```

All 85,034 sounds have exactly this 82-byte header. The audio is MP3 (MPEG-2 Layer III
frame sync `FF F2`/`FF F3` at the first byte), playable by browsers as-is. The reader
locates the audio as the last `dataLen` bytes of the enclosing `0x09` block, which avoids
depending on the header length.

## `.ms` packs (`Data/Packs/*.ms`)

Mob and Skill data are stored in `.ms` pack files instead of PKG1 archives. A pack is a
header, an encrypted entry table and a data area; each entry is one `.img` in the usual
property format. Version 4 of the pack layout is used by both Classic World packs.

Source of these facts: learned from the open-source WzComparerR2 project's `.ms` reader, 
then **re-verified against the Classic World packs** by the independently written 
implementation in `src/ms/`. No code was copied.

Verification: both packs pass the header check. All 164 entries have valid checksums, and
all 162 image entries parse with zero failures. Decrypted sprites render correctly (e.g.
`Mob/0000040.img/stand/0`). The ChaCha20 implementation passes the RFC 8439 test vectors.
Observed values: `flags` is 6 and `unk1`/`unk2` are 0 for every entry; `unk3`/`unk4`
look random.

### Cipher

Standard ChaCha20 as in RFC 8439: 16-word state = constants `"expand 32-byte k"`,
32-byte key, word 12 = 32-bit block counter, words 13–15 = 96-bit nonce; 20 rounds
(10 double rounds); keystream block = working state + input state, little-endian. When the
counter wraps from `0xFFFFFFFF` to 0, word 13 is incremented.

All key derivations below XOR the 32 derived bytes with this constant ("key mask"):

```
7B 2F 35 48 43 95 02 B9 AE 91 A6 E1 D8 D6 24 B4
33 10 1D 3D C1 BB C6 F4 A5 FE B3 69 6B 56 E4 75
```

### Header

`name` is the pack's file name, lower-cased, with extension (`mob_00000.ms`);
`Σ` sums UTF-16 code units.

```
r[n]         random prefix, n = Σ(name) % 312 + 30 bytes
             each byte is "unscrambled" as an arithmetic shift of a signed byte:
             r'[i] = (int8)r[i] >> 1, kept as a byte
u8   v       version = v ^ r'[0]; must be 4
i32  s       salt length = (s & 0xFF) ^ r'[0]
u16[len]     salt units; salt char i is computed from the LOW byte only:
             a = r'[i] ^ lowbyte(unit[i]);  char = ((a | 0x4B) << 1) - a - 75
-- header start H = position after the salt --
8 bytes      ChaCha20-encrypted (key K1, zero nonce, counter 0): i32 hash, i32 entryCount
```

`K1[i] = byte(fs[i % |fs|] + i) ^ mask[i]` for `i` in 0..31, where `fs = name + salt`.

Check: `hash == s + v + version + entryCount + Σ(salt units as u16)` (32-bit wrapping).

### Entry table

Starts at `H + 8 + (Σ(3 × name chars) % 212) + 64` (the bytes in between are filler).
Encrypted with ChaCha20, key `K2`, zero nonce, counter starting at 0:

`K2[i] = byte(i + (i % 3 + 2) × fs[|fs| − 1 − (i % |fs|)]) ^ mask[i]`

**Counter quirk:** the table is decrypted field by field through a 64-byte keystream
buffer. Whenever a field read finishes exactly at the end of a 64-byte keystream block,
the block counter is reset to 0, so the next block reuses counter 0 rather than continuing.
A reader must reproduce this to decrypt the table.

Each entry, read field by field in this order:

| Field | Type | Meaning |
|---|---|---|
| name | `i32 n`, then `n` UTF-16LE units (unmasked) | image path, `/`-separated (e.g. `…/0000001.img`) |
| checksum | i32 | `flags + start + size + sizeAligned + unk1 + Σ(key bytes)` |
| flags | i32 | `UNVERIFIED` meaning |
| start | i32 | block index: data at `dataStart + start × 1024` |
| size | i32 | image size in bytes |
| sizeAligned | i32 | size rounded up to 1024 |
| unk1, unk2 | i32, i32 | `UNVERIFIED` |
| key | 16 bytes | per-entry key material |
| unk3, unk4 | i32, i32 | `UNVERIFIED` |

`dataStart` = end of the entry table rounded up to a multiple of 1024.

### Entry data

Only the **first `min(size, 1024)` bytes** of each entry are encrypted; the rest is stored
in the clear. The first 1024 bytes are decrypted with ChaCha20 using a per-entry key, nonce
and counter derived as follows:

```
h  = FNV-1a 32-bit over the salt's UTF-16 units (offset 0x811C9DC5, prime 0x01000193,
     h = (h ^ unit) * prime)
h2 = h >>> 1
h3 = h2 ^ 0x6C
D  = decimal digits of h (unsigned), as numbers 0..9

image key, for i in 0..31 (N = entry name, k = entry key):
  K[i] = byte(i + N[i % |N|] × ( D[i % |D|] % 2
                               + k[(D[(i + 2) % |D|] + i) % 16]
                               + (D[(i + 1) % |D|] + i) % 5 )) ^ mask[i]

12 bytes t = u32le(h) ‖ u32le(h2) ‖ u32le(h3), then for i in 0..11, with
  a = 8i, b = 17i, c = 90 + 43i, d = −i:
  t[i] ^= byte(d + 11 × floor(i / 11) + (c ^ (i >> 2)) + (a ^ b))

nonce   = 4 zero bytes ‖ t[0..8]
counter = u32le(t[8..12])
```

The decrypted bytes are an ordinary image (see "Image (`.img`) layout").

## Reading strategy

`WzFileSystem` (`src/fs.ts`) parses an image from a sparse set of 64 KB blocks. The first 1 MB is
fetched up front; a read that hits a block not yet loaded aborts the parse, loads that block
and parses again. Pixel and audio payloads are skipped without being read, so a 15 MB BGM
image costs a few hundred KB of I/O to list.
