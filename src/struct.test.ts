import { describe, expect, test } from "bun:test";
import { Struct } from "./struct";
import { Type } from "./type";

describe("Struct", () => {
  test("Basic", () => {
    const s = Struct.new("Test", { a: Type.int(), b: Type.bool() });

    expect(s.declare().toString()).toBe(`struct Test\n{\nint a;\nbool b;\n};`);
  });
});
