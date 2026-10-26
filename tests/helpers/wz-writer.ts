/**
 * Test-only writer for synthetic WZ structures. It produces the inverse of what the reader
 * parses, so tests never need real game data.
 */

export class ByteWriter {
  private bytes: number[] = [];

  get length(): number {
    return this.bytes.length;
  }

  u8(v: number): this {
    this.bytes.push(v & 0xff);

    return this;
  }

  u16(v: number): this {
    return this.u8(v).u8(v >> 8);
  }

  u32(v: number): this {
    return this.u8(v).u8(v >> 8).u8(v >> 16).u8(v >>> 24);
  }

  i32(v: number): this {
    return this.u32(v >>> 0);
  }

  i64(v: bigint): this {
    const view = new DataView(new ArrayBuffer(8));

    view.setBigInt64(0, v, true);

    return this.raw(new Uint8Array(view.buffer));
  }

  f32(v: number): this {
    const view = new DataView(new ArrayBuffer(4));

    view.setFloat32(0, v, true);

    return this.raw(new Uint8Array(view.buffer));
  }

  raw(data: ArrayLike<number>): this {
    for (let i = 0; i < data.length; i++) {
      this.bytes.push(data[i] & 0xff);
    }

    return this;
  }

  /** Overwrites a u32 at an earlier position. */
  patchU32(at: number, v: number): void {
    this.bytes[at] = v & 0xff;
    this.bytes[at + 1] = (v >> 8) & 0xff;
    this.bytes[at + 2] = (v >> 16) & 0xff;
    this.bytes[at + 3] = (v >>> 24) & 0xff;
  }

  cint(v: number): this {
    if (v > 127 || v <= -128) {
      return this.u8(0x80).i32(v);
    }

    return this.u8(v);
  }

  /** Encrypted string: ASCII if every char is < 0x80, otherwise UTF-16. */
  wzString(text: string): this {
    if (text.length === 0) {
      return this.u8(0);
    }

    const ascii = [...text].every((c) => c.charCodeAt(0) < 0x80);

    if (ascii) {
      if (text.length >= 128) {
        this.u8(0x80).i32(text.length);
      } else {
        this.u8(-text.length);
      }

      let mask = 0xaa;

      for (const c of text) {
        this.u8(c.charCodeAt(0) ^ mask);
        mask = (mask + 1) & 0xff;
      }

      return this;
    }

    if (text.length >= 127) {
      this.u8(127).i32(text.length);
    } else {
      this.u8(text.length);
    }

    let mask = 0xaaaa;

    for (let i = 0; i < text.length; i++) {
      this.u16(text.charCodeAt(i) ^ mask);
      mask = (mask + 1) & 0xffff;
    }

    return this;
  }

  toBytes(): Uint8Array {
    return Uint8Array.from(this.bytes);
  }
}

/** A property value for `writeImage`. */
export type TestValue =
  | { int: number }
  | { short: number }
  | { long: bigint }
  | { float: number }
  | { string: string; byOffset?: boolean }
  | { vector: [number, number] }
  | { uol: string }
  | { canvas: { width: number; height: number; format: number; payload: Uint8Array; props?: TestProps } }
  | { convex: [number, number][] }
  | { props: TestProps };

export type TestProps = [string, TestValue][];

/**
 * Serializes an image: an extended "Property" object holding `props`.
 * Strings marked `byOffset` are written once at the end and referenced by offset.
 */
export function writeImage(props: TestProps): Uint8Array {
  const w = new ByteWriter();
  const deferred: { at: number; text: string }[] = [];

  const stringBlock = (text: string, byOffset = false) => {
    if (byOffset) {
      w.u8(0x01);
      deferred.push({ at: w.length, text });
      w.i32(0);
    } else {
      w.u8(0x00).wzString(text);
    }
  };

  const typeName = (name: string) => w.u8(0x73).wzString(name);

  const list = (entries: TestProps) => {
    w.u16(0).cint(entries.length);

    for (const [name, value] of entries) {
      stringBlock(name);
      property(value);
    }
  };

  const extendedBody = (value: TestValue) => {
    if ("props" in value) {
      typeName("Property");
      list(value.props);
    } else if ("vector" in value) {
      typeName("Shape2D#Vector2D");
      w.cint(value.vector[0]).cint(value.vector[1]);
    } else if ("uol" in value) {
      typeName("UOL");
      w.u8(0);
      stringBlock(value.uol);
    } else if ("convex" in value) {
      typeName("Shape2D#Convex2D");
      w.cint(value.convex.length);

      for (const [x, y] of value.convex) {
        typeName("Shape2D#Vector2D");
        w.cint(x).cint(y);
      }
    } else if ("canvas" in value) {
      const c = value.canvas;

      typeName("Canvas");
      w.u8(0);

      if (c.props) {
        w.u8(1);
        list(c.props);
      } else {
        w.u8(0);
      }

      w.cint(c.width).cint(c.height).cint(c.format).u8(0).i32(0).i32(c.payload.length + 1).u8(0);
      w.raw(c.payload);
    } else {
      throw new Error("not an extended value");
    }
  };

  const property = (value: TestValue) => {
    if ("int" in value) {
      w.u8(0x03).cint(value.int);
    } else if ("short" in value) {
      w.u8(0x02).u16(value.short);
    } else if ("long" in value) {
      w.u8(0x14).u8(0x80).i64(value.long);
    } else if ("float" in value) {
      w.u8(0x04).u8(0x80).f32(value.float);
    } else if ("string" in value) {
      w.u8(0x08);
      stringBlock(value.string, value.byOffset);
    } else {
      w.u8(0x09);

      const sizeAt = w.length;

      w.u32(0);
      extendedBody(value);
      w.patchU32(sizeAt, w.length - sizeAt - 4);
    }
  };

  typeName("Property");
  list(props);

  // An offset string block points (image-relative) straight at an encrypted string.
  for (const d of deferred) {
    w.patchU32(d.at, w.length);
    w.wzString(d.text);
  }

  return w.toBytes();
}
