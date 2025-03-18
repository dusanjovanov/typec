import { describe, expect, test } from "bun:test";
import { Type } from "./type";
import type { SimpleType } from "./types";
import { Value } from "./value";

const types: SimpleType[] = [
  "char",
  "signed char",
  "unsigned char",
  "short",
  "unsigned short",
  "int",
  "unsigned int",
  "long",
  "unsigned long",
  "long long",
  "unsigned long long",
  "size_t",
  "ptrdiff_t",
  "float",
  "double",
  "long double",
  "wchar_t",
  "void",
];

const typesWithShortcuts = [
  "int",
  "size_t",
  "char",
  "unsigned int",
  "short",
  "wchar_t",
  "bool",
] as const satisfies SimpleType[];

describe("Value.new", () => {
  types.forEach((type) => {
    test(type, () => {
      const _t = Value.new("test");
      expect(_t.kind).toBe("value");
      expect(_t.value).toBe("test");
      expect(_t.toString()).toBe("test");
    });
  });
});

typesWithShortcuts.forEach((type) => {
  describe(`Value.${type}`, () => {
    test(type, () => {
      const _t = (Value as any)[type.replaceAll(/\s/g, "_")]("test");
      expect(_t.kind).toBe("value");
      expect(_t.value).toBe("test");
      expect(_t.toString()).toBe("test");
    });
  });
});
