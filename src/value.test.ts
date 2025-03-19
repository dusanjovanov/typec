import { describe, expect, test } from "bun:test";
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
