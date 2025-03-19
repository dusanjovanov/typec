import { describe, expect, test } from "bun:test";
import { Type } from "./type";
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

describe("Type.simple", () => {
  types.forEach((type) => {
    test(type, () => {
      const _t = Type.simple(type);
      if (_t.desc.kind === "simple") {
        expect(_t.desc.specifier).toBe(type);
        expect(_t.desc.qualifiers).toEqual([]);
        expect(_t.full).toBe(type);
      } else throw Error();
    });
    test(`const ${type}`, () => {
      const _t = Type.simple(type, ["const"]);
      if (_t.desc.kind === "simple") {
        expect(_t.desc.specifier).toBe(type);
        expect(_t.desc.qualifiers).toEqual(["const"]);
        expect(_t.full).toBe(`const ${type}`);
      } else throw Error();
    });
    test(`const volatile ${type}`, () => {
      const _t = Type.simple(type, ["const", "volatile"]);
      if (_t.desc.kind === "simple") {
        expect(_t.desc.specifier).toBe(type as any);
        expect(_t.desc.qualifiers).toEqual(["const", "volatile"]);
        expect(_t.full).toBe(`const volatile ${type}`);
      } else throw Error();
    });
  });
});

typesWithShortcuts.forEach((type) => {
  describe(`Simple.${type}`, () => {
    test(type, () => {
      const _t = Type[type]();
      if (_t.desc.kind === "simple") {
        expect(_t.desc.specifier).toBe(type);
        expect(_t.desc.qualifiers).toEqual([]);
        expect(_t.full).toBe(type);
      } else throw Error();
    });
    test(`const ${type}`, () => {
      const _t = Type[type](["const"]);
      if (_t.desc.kind === "simple") {
        expect(_t.desc.specifier).toBe(type);
        expect(_t.desc.qualifiers).toEqual(["const"]);
        expect(_t.full).toBe(`const ${type}`);
      } else throw Error();
    });
    test(`const volatile ${type}`, () => {
      const _t = Type[type](["const", "volatile"]);
      if (_t.desc.kind === "simple") {
        expect(_t.desc.specifier).toBe(type);
        expect(_t.desc.qualifiers).toEqual(["const", "volatile"]);
        expect(_t.full).toBe(`const volatile ${type}`);
      } else throw Error();
    });
  });
});

describe("ArrayType", () => {
  test("Simple element", () => {
    const elType = Type.int();
    const _t = Type.array(elType, 3);
    if (_t.desc.kind === "array") {
      expect(_t.desc.elementType).toEqual(elType);
      expect(_t.desc.length).toEqual(3);
      expect(_t.full).toBe(`int [3]`);
    }
  });
  test("Pointer element", () => {
    const elType = Type.pointer(Type.int());
    const _t = Type.array(elType, 3);
    if (_t.desc.kind === "array") {
      expect(_t.desc.elementType).toEqual(elType);
      expect(_t.desc.length).toEqual(3);
      expect(_t.full).toBe(`int* [3]`);
    }
  });
});

describe("FuncType", () => {
  test("Simple return and params", () => {
    const returnType = Type.void();
    const paramTypes = [Type.char(), Type.int()];
    const _t = Type.func(returnType, paramTypes);
    if (_t.desc.kind === "func") {
      expect(_t.desc.returnType).toEqual(returnType);
      expect(_t.desc.paramTypes).toEqual(paramTypes);
      expect(_t.full).toBe(`void (char,int)`);
    } else throw Error();
  });
  test("Simple const return and const params", () => {
    const returnType = Type.void(["const"]);
    const paramTypes = [Type.char(["const"]), Type.int(["const"])];
    const _t = Type.func(returnType, paramTypes);
    if (_t.desc.kind === "func") {
      expect(_t.desc.returnType).toEqual(returnType);
      expect(_t.desc.paramTypes).toEqual(paramTypes);
      expect(_t.full).toBe(`const void (const char,const int)`);
    } else throw Error();
  });
  test("const Pointer const return and const Pointer const params", () => {
    const returnType = Type.pointer(Type.void(["const"]), ["const"]);
    const paramTypes = [
      Type.pointer(Type.char(["const"]), ["const"]),
      Type.pointer(Type.int(["const"]), ["const"]),
    ];
    const _t = Type.func(returnType, paramTypes);
    if (_t.desc.kind === "func") {
      expect(_t.desc.returnType).toEqual(returnType);
      expect(_t.desc.paramTypes).toEqual(paramTypes);
      expect(_t.full).toBe(
        `const void* const (const char* const,const int* const)`
      );
    } else throw Error();
  });
});
