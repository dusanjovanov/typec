import { describe, expect, test } from "bun:test";
import { ArrayType } from "./array";
import { Pointer } from "./pointer";
import { Simple } from "./simple";
import type { SimpleSpecifier } from "./types";

const types: SimpleSpecifier[] = [
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

// const typesWithShortcuts = [
//   "int",
//   "size_t",
//   "void",
//   "char",
// ] as const satisfies SimpleSpecifier[];

describe("Pointer", () => {
  describe("Simple", () => {
    types.forEach((type) => {
      test(type, () => {
        const dataType = Simple.type(type);
        const _t = Pointer.type(dataType);
        expect(_t.type).toEqual(dataType);
        expect(_t.specifier).toBe(`${type}*`);
        expect(_t.qualifiers).toEqual([]);
        expect(_t.full).toBe(`${type}*`);
      });
      test(`const ${type}`, () => {
        const dataType = Simple.type(type, ["const"]);
        const _t = Pointer.type(dataType);
        expect(_t.specifier).toBe(`const ${type}*`);
        expect(_t.qualifiers).toEqual([]);
        expect(_t.full).toBe(`const ${type}*`);
      });
      test(`const volatile ${type}`, () => {
        const dataType = Simple.type(type, ["const", "volatile"]);
        const _t = Pointer.type(dataType);
        expect(_t.specifier).toBe(`const volatile ${type}*`);
        expect(_t.qualifiers).toEqual([]);
        expect(_t.full).toBe(`const volatile ${type}*`);
      });
      test(`${type}* const`, () => {
        const dataType = Simple.type(type);
        const _t = Pointer.type(dataType, ["const"]);
        expect(_t.type).toEqual(dataType);
        expect(_t.specifier).toBe(`${type}*`);
        expect(_t.qualifiers).toEqual(["const"]);
        expect(_t.full).toBe(`${type}* const`);
      });
      test(`const ${type}* const`, () => {
        const dataType = Simple.type(type, ["const"]);
        const _t = Pointer.type(dataType, ["const"]);
        expect(_t.type).toEqual(dataType);
        expect(_t.specifier).toBe(`const ${type}*`);
        expect(_t.qualifiers).toEqual(["const"]);
        expect(_t.full).toBe(`const ${type}* const`);
      });
    });
  });

  describe("ArrayType", () => {
    test("Simple", () => {
      const dataType = ArrayType.new(Simple.type("int"), 3);
      const _t = Pointer.type(dataType);
      expect(_t.type).toEqual(dataType);
      expect(_t.specifier).toBe(`int (*)[3]`);
      expect(_t.qualifiers).toEqual([]);
      expect(_t.full).toBe(`int (*)[3]`);
    });
    test("Pointer->Simple", () => {
      const dataType = ArrayType.new(Pointer.type(Simple.type("int")), 3);
      const _t = Pointer.type(dataType);
      expect(_t.type).toEqual(dataType);
      expect(_t.specifier).toBe(`int* (*)[3]`);
      expect(_t.qualifiers).toEqual([]);
      expect(_t.full).toBe(`int* (*)[3]`);
    });
  });

  describe("Pointer", () => {
    test("Simple", () => {
      const dataType = Pointer.type(Simple.type("int"));
      const _t = Pointer.type(dataType);
      expect(_t.type).toEqual(dataType);
      expect(_t.specifier).toBe(`int**`);
      expect(_t.qualifiers).toEqual([]);
      expect(_t.full).toBe(`int**`);
    });

    test("ArrayType->Simple", () => {
      const dataType = Pointer.type(ArrayType.new(Simple.type("int"), 3));
      const _t = Pointer.type(dataType);
      expect(_t.type).toEqual(dataType);
      expect(_t.specifier).toBe(`int (**)[3]`);
      expect(_t.qualifiers).toEqual([]);
      expect(_t.full).toBe(`int (**)[3]`);
    });
  });
});

// typesWithShortcuts.forEach((type) => {
//   describe(`Simple.${type}`, () => {
//     test(type, () => {
//       const _t = Simple[type]();
//       expect(_t.specifier).toBe(type as any);
//       expect(_t.qualifiers).toEqual([]);
//       expect(_t.full).toBe(type);
//     });
//     test(`const ${type}`, () => {
//       const _t = Simple[type](["const"]);
//       expect(_t.specifier).toBe(type as any);
//       expect(_t.qualifiers).toEqual(["const"]);
//       expect(_t.full).toBe(`const ${type}`);
//     });
//     test(`const volatile ${type}`, () => {
//       const _t = Simple[type](["const", "volatile"]);
//       expect(_t.specifier).toBe(type as any);
//       expect(_t.qualifiers).toEqual(["const", "volatile"]);
//       expect(_t.full).toBe(`const volatile ${type}`);
//     });
//   });
// });
