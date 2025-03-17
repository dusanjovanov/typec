import { describe, expect, test } from "bun:test";
import { Simple } from "./simple";
import type { SimpleType } from "./types";

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
  "void",
  "char",
] as const satisfies SimpleType[];

describe("Simple.type", () => {
  types.forEach((type) => {
    test(type, () => {
      const _t = Simple.type(type);
      expect(_t.specifier).toBe(type as any);
      expect(_t.qualifiers).toEqual([]);
      expect(_t.full).toBe(type);
    });
    test(`const ${type}`, () => {
      const _t = Simple.type(type, ["const"]);
      expect(_t.specifier).toBe(type as any);
      expect(_t.qualifiers).toEqual(["const"]);
      expect(_t.full).toBe(`const ${type}`);
    });
    test(`const volatile ${type}`, () => {
      const _t = Simple.type(type, ["const", "volatile"]);
      expect(_t.specifier).toBe(type as any);
      expect(_t.qualifiers).toEqual(["const", "volatile"]);
      expect(_t.full).toBe(`const volatile ${type}`);
    });
  });
});

typesWithShortcuts.forEach((type) => {
  describe(`Simple.${type}`, () => {
    test(type, () => {
      const _t = Simple[type]();
      expect(_t.specifier).toBe(type as any);
      expect(_t.qualifiers).toEqual([]);
      expect(_t.full).toBe(type);
    });
    test(`const ${type}`, () => {
      const _t = Simple[type](["const"]);
      expect(_t.specifier).toBe(type as any);
      expect(_t.qualifiers).toEqual(["const"]);
      expect(_t.full).toBe(`const ${type}`);
    });
    test(`const volatile ${type}`, () => {
      const _t = Simple[type](["const", "volatile"]);
      expect(_t.specifier).toBe(type as any);
      expect(_t.qualifiers).toEqual(["const", "volatile"]);
      expect(_t.full).toBe(`const volatile ${type}`);
    });
  });
});
