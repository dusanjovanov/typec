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
  "ptrdiff_t",
  "short",
] as const satisfies SimpleType[];

describe("Simple", () => {
  types.forEach((type) => {
    test(type, () => {
      const _t = Type.simple(type);
      if (_t.desc.kind === "simple") {
        expect(_t.desc.specifier).toBe(type);
        expect(_t.desc.qualifiers).toEqual([]);
        expect(_t.str).toBe(type);
      } else throw Error();
    });
    test(`const ${type}`, () => {
      const _t = Type.simple(type, ["const"]);
      if (_t.desc.kind === "simple") {
        expect(_t.desc.specifier).toBe(type);
        expect(_t.desc.qualifiers).toEqual(["const"]);
        expect(_t.str).toBe(`const ${type}`);
      } else throw Error();
    });
    test(`const volatile ${type}`, () => {
      const _t = Type.simple(type, ["const", "volatile"]);
      if (_t.desc.kind === "simple") {
        expect(_t.desc.specifier).toBe(type as any);
        expect(_t.desc.qualifiers).toEqual(["const", "volatile"]);
        expect(_t.str).toBe(`const volatile ${type}`);
      } else throw Error();
    });
  });
});

typesWithShortcuts.forEach((type) => {
  describe(`Type.${type}`, () => {
    test(type, () => {
      const _t = Type[type]();
      if (_t.desc.kind === "simple") {
        expect(_t.desc.specifier).toBe(type);
        expect(_t.desc.qualifiers).toEqual([]);
        expect(_t.str).toBe(type);
      } else throw Error();
    });
    test(`const ${type}`, () => {
      const _t = Type[type](["const"]);
      if (_t.desc.kind === "simple") {
        expect(_t.desc.specifier).toBe(type);
        expect(_t.desc.qualifiers).toEqual(["const"]);
        expect(_t.str).toBe(`const ${type}`);
      } else throw Error();
    });
    test(`const volatile ${type}`, () => {
      const _t = Type[type](["const", "volatile"]);
      if (_t.desc.kind === "simple") {
        expect(_t.desc.specifier).toBe(type);
        expect(_t.desc.qualifiers).toEqual(["const", "volatile"]);
        expect(_t.str).toBe(`const volatile ${type}`);
      } else throw Error();
    });
  });
});

describe("Array", () => {
  test("Simple element", () => {
    const elType = Type.int();
    const _t = Type.array(elType, 3);
    if (_t.desc.kind === "array") {
      expect(_t.desc.elementType).toEqual(elType);
      expect(_t.desc.length).toEqual(3);
      expect(_t.str).toBe(`int [3]`);
    }
  });
  test("Pointer element", () => {
    const elType = Type.pointer(Type.int());
    const _t = Type.array(elType, 3);
    if (_t.desc.kind === "array") {
      expect(_t.desc.elementType).toEqual(elType);
      expect(_t.desc.length).toEqual(3);
      expect(_t.str).toBe(`int* [3]`);
    }
  });
});

describe("Func", () => {
  test("Simple", () => {
    const returnType = Type.void();
    const paramTypes = [Type.char(), Type.int()];
    const _t = Type.func(returnType, paramTypes);
    if (_t.desc.kind === "func") {
      expect(_t.desc.returnType).toEqual(returnType);
      expect(_t.desc.paramTypes).toEqual(paramTypes);
      expect(_t.str).toBe(`void (char,int)`);
    } else throw Error();
  });
  test("Simple complex", () => {
    const returnType = Type.void(["const"]);
    const paramTypes = [Type.char(["const"]), Type.int(["const"])];
    const _t = Type.func(returnType, paramTypes);
    if (_t.desc.kind === "func") {
      expect(_t.desc.returnType).toEqual(returnType);
      expect(_t.desc.paramTypes).toEqual(paramTypes);
      expect(_t.str).toBe(`const void (const char,const int)`);
    } else throw Error();
  });
  test("Func with pointers complex", () => {
    const returnType = Type.pointer(Type.void(["const"]), ["const"]);
    const paramTypes = [
      Type.pointer(Type.char(["const"]), ["const"]),
      Type.pointer(Type.int(["const"]), ["const"]),
    ];
    const _t = Type.func(returnType, paramTypes);
    if (_t.desc.kind === "func") {
      expect(_t.desc.returnType).toEqual(returnType);
      expect(_t.desc.paramTypes).toEqual(paramTypes);
      expect(_t.str).toBe(
        `const void* const (const char* const,const int* const)`
      );
    } else throw Error();
  });
});

describe("Pointer", () => {
  test("Struct", () => {
    const structType = Type.struct("abc");
    const type = Type.pointer(structType);
    if (type.desc.kind === "pointer") {
      expect(type.desc.type).toBe(structType);
      expect(type.desc.qualifiers).toEqual([]);
      expect(type.str).toBe(`struct abc*`);
    } else throw Error();
  });
  test("Struct complex", () => {
    const structType = Type.struct("abc", ["const"]);
    const type = Type.pointer(structType, ["const"]);
    if (type.desc.kind === "pointer") {
      expect(type.desc.type).toBe(structType);
      expect(type.desc.qualifiers).toEqual(["const"]);
      expect(type.str).toBe(`const struct abc* const`);
    } else throw Error();
  });
  test("Func", () => {
    const returnType = Type.void();
    const paramTypes = [Type.char(), Type.int()];
    const funcType = Type.func(returnType, paramTypes);
    const type = Type.pointer(funcType);
    if (type.desc.kind === "pointer") {
      expect(type.desc.type).toEqual(funcType);
      expect(type.str).toBe(`void (*)(char,int)`);
    } else throw Error();
  });
  test("Pointer Func", () => {
    const ptrType = Type.pointer(
      Type.func(Type.void(), [Type.char(), Type.int()])
    );
    const type = Type.pointer(ptrType);
    if (type.desc.kind === "pointer") {
      expect(type.desc.type).toEqual(ptrType);
      expect(type.str).toBe(`void (**)(char,int)`);
    } else throw Error();
  });
  test("Pointer Func complex", () => {
    const ptrType = Type.pointer(
      Type.func(Type.void(["const"]), [Type.char(), Type.int()]),
      ["const"]
    );
    const type = Type.pointer(ptrType, ["const"]);
    if (type.desc.kind === "pointer") {
      expect(type.desc.type).toEqual(ptrType);
      expect(type.str).toBe(`const void (*const*const)(char,int)`);
    } else throw Error();
  });
  test("Array", () => {
    const arrType = Type.array(Type.int(), 3);
    const type = Type.pointer(arrType);
    if (type.desc.kind === "pointer") {
      expect(type.desc.type).toBe(arrType);
      expect(type.desc.qualifiers).toEqual([]);
      expect(type.str).toBe(`int (*)[3]`);
    } else throw Error();
  });

  test("Pointer Array", () => {
    const ptrType = Type.pointer(Type.array(Type.int(), 3));
    const type = Type.pointer(ptrType);
    if (type.desc.kind === "pointer") {
      expect(type.desc.type).toBe(ptrType);
      expect(type.desc.qualifiers).toEqual([]);
      expect(type.str).toBe(`int (**)[3]`);
    } else throw Error();
  });

  test("Pointer Array complex", () => {
    const ptrType = Type.pointer(Type.array(Type.int(["const"]), 3), ["const"]);
    const type = Type.pointer(ptrType, ["const"]);
    if (type.desc.kind === "pointer") {
      expect(type.desc.type).toBe(ptrType);
      expect(type.desc.qualifiers).toEqual(["const"]);
      expect(type.str).toBe(`const int (*const*const)[3]`);
    } else throw Error();
  });
});
