import { describe, expect, test } from "bun:test";
import { Array } from "./array";
import { FuncType } from "./func";
import { Pointer } from "./pointer";
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
        expect(_t.qualifiers).toEqual([]);
        expect(_t.full).toBe(`${type}*`);
      });
      test(`const ${type}`, () => {
        const dataType = Simple.type(type, ["const"]);
        const _t = Pointer.type(dataType);
        expect(_t.qualifiers).toEqual([]);
        expect(_t.full).toBe(`const ${type}*`);
      });
      test(`const volatile ${type}`, () => {
        const dataType = Simple.type(type, ["const", "volatile"]);
        const _t = Pointer.type(dataType);
        expect(_t.qualifiers).toEqual([]);
        expect(_t.full).toBe(`const volatile ${type}*`);
      });
      test(`${type}* const`, () => {
        const dataType = Simple.type(type);
        const _t = Pointer.type(dataType, ["const"]);
        expect(_t.type).toEqual(dataType);
        expect(_t.qualifiers).toEqual(["const"]);
        expect(_t.full).toBe(`${type}* const`);
      });
      test(`const ${type}* const`, () => {
        const dataType = Simple.type(type, ["const"]);
        const _t = Pointer.type(dataType, ["const"]);
        expect(_t.type).toEqual(dataType);
        expect(_t.qualifiers).toEqual(["const"]);
        expect(_t.full).toBe(`const ${type}* const`);
      });
    });
  });

  describe("ArrayType", () => {
    test("Simple", () => {
      const dataType = Array.type(Simple.type("int"), 3);
      const _t = Pointer.type(dataType);
      expect(_t.type).toEqual(dataType);
      expect(_t.qualifiers).toEqual([]);
      expect(_t.full).toBe(`int (*)[3]`);
    });
    describe("Pointer", () => {
      test("Simple", () => {
        const dataType = Array.type(Pointer.type(Simple.type("int")), 3);
        const _t = Pointer.type(dataType);
        expect(_t.type).toEqual(dataType);
        expect(_t.qualifiers).toEqual([]);
        expect(_t.full).toBe(`int* (*)[3]`);
      });

      test("const Simple* const", () => {
        const dataType = Array.type(
          Pointer.type(Simple.type("int", ["const"]), ["const"]),
          3
        );
        const _t = Pointer.type(dataType);
        expect(_t.type).toEqual(dataType);
        expect(_t.qualifiers).toEqual([]);
        expect(_t.full).toBe(`const int* const (*)[3]`);
      });
    });
  });

  describe("FuncType", () => {
    test("Simple", () => {
      const dataType = FuncType.new(Simple.type("void"), [
        Simple.char(),
        Simple.int(),
      ]);
      const _t = Pointer.type(dataType);
      expect(_t.type).toEqual(dataType);
      expect(_t.qualifiers).toEqual([]);
      expect(_t.full).toBe(`void (*)(char,int)`);
    });
  });

  describe("Pointer", () => {
    test("Simple", () => {
      const dataType = Pointer.type(Simple.type("int"));
      const _t = Pointer.type(dataType);
      expect(_t.type).toEqual(dataType);
      expect(_t.qualifiers).toEqual([]);
      expect(_t.full).toBe(`int**`);
    });

    describe("ArrayType", () => {
      test("Simple", () => {
        const dataType = Pointer.type(Array.type(Simple.type("int"), 3));
        const _t = Pointer.type(dataType);
        expect(_t.type).toEqual(dataType);
        expect(_t.qualifiers).toEqual([]);
        expect(_t.full).toBe(`int (**)[3]`);
      });

      test("const Simple* const", () => {
        const dataType = Pointer.type(
          Array.type(Simple.type("int", ["const"]), 3),
          ["const"]
        );
        const _t = Pointer.type(dataType);
        expect(_t.type).toEqual(dataType);
        expect(_t.qualifiers).toEqual([]);
        expect(_t.full).toBe(`const int (**const)[3]`);
      });
    });

    describe("FuncType", () => {
      test("Simple", () => {
        const dataType = Pointer.type(
          FuncType.new(Simple.type("void"), [Simple.char(), Simple.int()])
        );
        const _t = Pointer.type(dataType);
        expect(_t.type).toEqual(dataType);
        expect(_t.qualifiers).toEqual([]);
        expect(_t.full).toBe(`void (**)(char,int)`);
      });
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
