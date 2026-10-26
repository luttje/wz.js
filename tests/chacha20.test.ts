import { describe, expect, it } from "vitest";

import { BLOCK_LENGTH, ChaCha20, FieldDecryptor } from "../src/ms/chacha20.ts";

const hex = (bytes: Uint8Array) => Buffer.from(bytes).toString("hex");
const fromHex = (text: string) => Uint8Array.from(Buffer.from(text.replace(/\s+/g, ""), "hex"));

const RFC_KEY = Uint8Array.from({ length: 32 }, (_, i) => i);

describe("ChaCha20", () => {
  it("matches the RFC 8439 block function test vector (2.3.2)", () => {
    const nonce = fromHex("000000090000004a00000000");
    const block = new ChaCha20(RFC_KEY, nonce, 1).next();

    expect(hex(block.subarray(0, 16))).toBe("10f1e7e4d13b5915500fdd1fa32071c4");
  });

  it("matches the RFC 8439 encryption test vector (2.4.2)", () => {
    const nonce = fromHex("000000000000004a00000000");
    const text = "Ladies and Gentlemen of the class of '99: If I could offer you only one tip for the future, sunscreen would be it.";
    const data = new TextEncoder().encode(text);

    new ChaCha20(RFC_KEY, nonce, 1).xor(data);

    expect(hex(data.subarray(0, 16))).toBe("6e2e359a2568f98041ba0728dd0d6981");
  });

  it("decrypts what it encrypts", () => {
    const nonce = new Uint8Array(12);
    const plain = Uint8Array.from({ length: 300 }, (_, i) => i & 0xff);
    const data = plain.slice();

    new ChaCha20(RFC_KEY, nonce, 7).xor(data);
    expect(data).not.toEqual(plain);

    new ChaCha20(RFC_KEY, nonce, 7).xor(data);
    expect(data).toEqual(plain);
  });

  it("carries the counter into word 13 when it wraps", () => {
    const cipher = new ChaCha20(RFC_KEY, new Uint8Array(12), 0xffffffff);

    cipher.next();

    expect(cipher.state[12]).toBe(0);
    expect(cipher.state[13]).toBe(1);
  });
});

describe("FieldDecryptor", () => {
  const nonce = new Uint8Array(12);

  /** Keystream block `n` (counter n) for the test key. */
  const block = (n: number) => new ChaCha20(RFC_KEY, nonce, n).next();

  it("restarts the counter at 0 when a read ends on a block boundary", () => {
    // Zero ciphertext decrypts to the raw keystream, which exposes the counter used.
    const reader = new FieldDecryptor(new Uint8Array(200), RFC_KEY, nonce);

    reader.read(60);
    reader.read(4); // ends exactly at byte 64

    expect(reader.read(10)).toEqual(block(0).subarray(0, 10));
  });

  it("continues normally when reads cross a boundary", () => {
    const reader = new FieldDecryptor(new Uint8Array(200), RFC_KEY, nonce);

    reader.read(30);

    const crossing = reader.read(40);

    expect(crossing.subarray(0, 34)).toEqual(block(0).subarray(30, BLOCK_LENGTH));
    expect(crossing.subarray(34)).toEqual(block(1).subarray(0, 6));
  });
});
