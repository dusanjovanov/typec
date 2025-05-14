import { describe, expect, test } from "bun:test";
import { Par } from "./param";
import { Type } from "./type";
import { NUMBER_TYPES, type SimpleType } from "./types";

const types: SimpleType[] = [...NUMBER_TYPES, "void", "bool"];

const typesWithShortcuts = [
  "int",
  "size_t",
  "void",
  "char",
  "ptrdiff_t",
  "short",
  "double",
  "float",
  "bool",
] as const satisfies SimpleType[];

describe("Simple", () => {
  types.forEach((type) => {
    test(type, () => {
      const _type = Type.simple(type);
      expect(_type.toString()).toBe(type);
    });

    test(`const ${type}`, () => {
      const _type = Type.simple(type, ["const"]);
      expect(_type.toString()).toBe(`const ${type}`);
    });

    test(`const volatile ${type}`, () => {
      const _type = Type.simple(type, ["const", "volatile"]);
      expect(_type.toString()).toBe(`const volatile ${type}`);
    });
  });
});

typesWithShortcuts.forEach((type) => {
  describe(`Type.${type}`, () => {
    test(type, () => {
      const _type = Type[type]();
      expect(_type.toString()).toBe(type);
    });

    test(`const ${type}`, () => {
      const _type = Type[type](["const"]);
      expect(_type.toString()).toBe(`const ${type}`);
    });

    test(`const volatile ${type}`, () => {
      const _type = Type[type](["const", "volatile"]);
      expect(_type.toString()).toBe(`const volatile ${type}`);
    });
  });
});

describe("Array", () => {
  test("Simple element", () => {
    const type = Type.array(Type.int(), 3);
    if (type.desc.kind === "array") {
      expect(type.toString()).toBe(`int[3]`);
    }
  });

  test("Pointer element", () => {
    const type = Type.array(Type.int().ptr(), 3);
    expect(type.toString()).toBe(`int*[3]`);
  });
});

describe("Func", () => {
  test("Simple", () => {
    const type = Type.func(Type.void(), [Par.char("a"), Par.int("b")]);
    expect(type.toString()).toBe(`void(char a,int b)`);
  });

  test("Simple with const", () => {
    const type = Type.func(Type.void().const(), [
      Par.new(Type.char().const(), "a"),
      Par.new(Type.int().const(), "b"),
    ]);
    expect(type.toString()).toBe(`const void(const char a,const int b)`);
  });

  test("Func with pointers complex", () => {
    const type = Type.func(Type.void().const().ptr().const(), [
      Par.new(Type.char().const().ptr().const(), "a"),
      Par.new(Type.int().const().ptr().const(), "b"),
    ]);
    expect(type.toString()).toBe(
      `const void* const(const char* const a,const int* const b)`
    );
  });
});

describe("Struct", () => {
  test("simple", () => {
    const type = Type.struct("Test");
    expect(type.toString()).toBe(`struct Test`);
  });

  test("const", () => {
    const type = Type.struct("Test").const();
    expect(type.toString()).toBe(`const struct Test`);
  });
});

describe("Union", () => {
  test("simple", () => {
    const type = Type.union("Test", {});
    expect(type.toString()).toBe(`union Test`);
  });

  test("const", () => {
    const type = Type.union("Test", {}).const();
    expect(type.toString()).toBe(`const union Test`);
  });
});

describe("Pointer", () => {
  test("Struct", () => {
    const type = Type.struct("abc").ptr();
    expect(type.toString()).toBe(`struct abc*`);
  });

  test("Struct complex", () => {
    const type = Type.struct("abc").const().ptr().const();
    expect(type.toString()).toBe(`const struct abc* const`);
  });

  test("Func", () => {
    const type = Type.func(Type.void(), [
      Par.char("a"),
      Par.int("b"),
    ]).ptr();
    expect(type.toString()).toBe(`void(*)(char a,int b)`);
  });

  test("Pointer Func", () => {
    const type = Type.func(Type.void(), [Par.char("a"), Par.int("b")])
      .ptr()
      .ptr();
    expect(type.toString()).toBe(`void(**)(char a,int b)`);
  });

  test("Pointer Func complex", () => {
    const type = Type.func(Type.void(["const"]), [
      Par.char("a"),
      Par.int("b"),
    ])
      .ptr()
      .const()
      .ptr()
      .const();
    expect(type.toString()).toBe(`const void(*const*const)(char a,int b)`);
  });

  test("Array", () => {
    const type = Type.array(Type.int(), 3).ptr();
    expect(type.toString()).toBe(`int(*)[3]`);
  });

  test("Array no length", () => {
    const type = Type.array(Type.int()).ptr();
    expect(type.toString()).toBe(`int(*)[]`);
  });

  test("Pointer Array", () => {
    const type = Type.array(Type.int(), 3).ptr().ptr();
    expect(type.toString()).toBe(`int(**)[3]`);
  });

  test("Pointer Array complex", () => {
    const type = Type.array(Type.int().const(), 3)
      .ptr()
      .const()
      .ptr()
      .const();
    expect(type.toString()).toBe(`const int(*const*const)[3]`);
  });

  test("Double pointer", () => {
    const type = Type.void().ptr().ptr();
    expect(type.declare("test")).toBe(`void** test`);
  });
});
