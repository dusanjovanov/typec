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

// typesWithShortcuts.forEach((type) => {
//   describe(`Simple.${type}`, () => {
//     test(type, () => {
//       const _t = Type[type]();
//       expect(_t.specifier).toBe(type as any);
//       expect(_t.qualifiers).toEqual([]);
//       expect(_t.full).toBe(type);
//     });
//     test(`const ${type}`, () => {
//       const _t = Type[type](["const"]);
//       expect(_t.specifier).toBe(type as any);
//       expect(_t.qualifiers).toEqual(["const"]);
//       expect(_t.full).toBe(`const ${type}`);
//     });
//     test(`const volatile ${type}`, () => {
//       const _t = Type[type](["const", "volatile"]);
//       expect(_t.specifier).toBe(type as any);
//       expect(_t.qualifiers).toEqual(["const", "volatile"]);
//       expect(_t.full).toBe(`const volatile ${type}`);
//     });
//   });
// });

// describe("Pointer", () => {
//   describe("Simple", () => {
//     types.forEach((type) => {
//       test(type, () => {
//         const dataType = Type.new(type);
//         const _t = Pointer.type(dataType);
//         expect(_t.type).toEqual(dataType);
//         expect(_t.qualifiers).toEqual([]);
//         expect(_t.full).toBe(`${type}*`);
//       });
//       test(`const ${type}`, () => {
//         const dataType = Type.new(type, ["const"]);
//         const _t = Pointer.type(dataType);
//         expect(_t.qualifiers).toEqual([]);
//         expect(_t.full).toBe(`const ${type}*`);
//       });
//       test(`const volatile ${type}`, () => {
//         const dataType = Type.new(type, ["const", "volatile"]);
//         const _t = Pointer.type(dataType);
//         expect(_t.qualifiers).toEqual([]);
//         expect(_t.full).toBe(`const volatile ${type}*`);
//       });
//       test(`${type}* const`, () => {
//         const dataType = Type.new(type);
//         const _t = Pointer.type(dataType, ["const"]);
//         expect(_t.type).toEqual(dataType);
//         expect(_t.qualifiers).toEqual(["const"]);
//         expect(_t.full).toBe(`${type}* const`);
//       });
//       test(`const ${type}* const`, () => {
//         const dataType = Type.new(type, ["const"]);
//         const _t = Pointer.type(dataType, ["const"]);
//         expect(_t.type).toEqual(dataType);
//         expect(_t.qualifiers).toEqual(["const"]);
//         expect(_t.full).toBe(`const ${type}* const`);
//       });
//     });
//   });

//   describe("ArrayType", () => {
//     test("Simple", () => {
//       const dataType = Array.type(Type.new("int"), 3);
//       const _t = Pointer.type(dataType);
//       expect(_t.type).toEqual(dataType);
//       expect(_t.qualifiers).toEqual([]);
//       expect(_t.full).toBe(`int (*)[3]`);
//     });
//     describe("Pointer", () => {
//       test("Simple", () => {
//         const dataType = Array.type(Pointer.type(Type.new("int")), 3);
//         const _t = Pointer.type(dataType);
//         expect(_t.type).toEqual(dataType);
//         expect(_t.qualifiers).toEqual([]);
//         expect(_t.full).toBe(`int* (*)[3]`);
//       });

//       test("const Simple* const", () => {
//         const dataType = Array.type(
//           Pointer.type(Type.new("int", ["const"]), ["const"]),
//           3
//         );
//         const _t = Pointer.type(dataType);
//         expect(_t.type).toEqual(dataType);
//         expect(_t.qualifiers).toEqual([]);
//         expect(_t.full).toBe(`const int* const (*)[3]`);
//       });
//     });
//   });

//   describe("FuncType", () => {
//     test("Simple", () => {
//       const dataType = FuncType.new(Type.new("void"), [
//         Type.char(),
//         Type.int(),
//       ]);
//       const _t = Pointer.type(dataType);
//       expect(_t.type).toEqual(dataType);
//       expect(_t.qualifiers).toEqual([]);
//       expect(_t.full).toBe(`void (*)(char,int)`);
//     });
//   });

//   describe("Pointer", () => {
//     test("Simple", () => {
//       const dataType = Pointer.type(Type.new("int"));
//       const _t = Pointer.type(dataType);
//       expect(_t.type).toEqual(dataType);
//       expect(_t.qualifiers).toEqual([]);
//       expect(_t.full).toBe(`int**`);
//     });

//     describe("ArrayType", () => {
//       test("Simple", () => {
//         const dataType = Pointer.type(Array.type(Type.new("int"), 3));
//         const _t = Pointer.type(dataType);
//         expect(_t.type).toEqual(dataType);
//         expect(_t.qualifiers).toEqual([]);
//         expect(_t.full).toBe(`int (**)[3]`);
//       });

//       test("const Simple* const", () => {
//         const dataType = Pointer.type(
//           Array.type(Type.new("int", ["const"]), 3),
//           ["const"]
//         );
//         const _t = Pointer.type(dataType);
//         expect(_t.type).toEqual(dataType);
//         expect(_t.qualifiers).toEqual([]);
//         expect(_t.full).toBe(`const int (**const)[3]`);
//       });
//     });

//     describe("FuncType", () => {
//       test("Simple", () => {
//         const dataType = Pointer.type(
//           FuncType.new(Type.new("void"), [Type.char(), Type.int()])
//         );
//         const _t = Pointer.type(dataType);
//         expect(_t.type).toEqual(dataType);
//         expect(_t.qualifiers).toEqual([]);
//         expect(_t.full).toBe(`void (**)(char,int)`);
//       });
//     });
//   });
// });
