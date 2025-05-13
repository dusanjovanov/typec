import { describe, expect, test } from "bun:test";
import { Param } from "./param";
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
    const type = Type.array(Type.int().pointer(), 3);
    expect(type.toString()).toBe(`int*[3]`);
  });
});

describe("Func", () => {
  test("Simple", () => {
    const type = Type.func(Type.void(), [Param.char("a"), Param.int("b")]);
    expect(type.toString()).toBe(`void(char a,int b)`);
  });

  test("Simple with const", () => {
    const type = Type.func(Type.void().const(), [
      Param.new(Type.char().const(), "a"),
      Param.new(Type.int().const(), "b"),
    ]);
    expect(type.toString()).toBe(`const void(const char a,const int b)`);
  });

  test("Func with pointers complex", () => {
    const type = Type.func(Type.void().const().pointer().const(), [
      Param.new(Type.char().const().pointer().const(), "a"),
      Param.new(Type.int().const().pointer().const(), "b"),
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
    const type = Type.struct("abc").pointer();
    expect(type.toString()).toBe(`struct abc*`);
  });

  test("Struct complex", () => {
    const type = Type.struct("abc").const().pointer().const();
    expect(type.toString()).toBe(`const struct abc* const`);
  });

  test("Func", () => {
    const type = Type.func(Type.void(), [
      Param.char("a"),
      Param.int("b"),
    ]).pointer();
    expect(type.toString()).toBe(`void(*)(char a,int b)`);
  });

  test("Pointer Func", () => {
    const type = Type.func(Type.void(), [Param.char("a"), Param.int("b")])
      .pointer()
      .pointer();
    expect(type.toString()).toBe(`void(**)(char a,int b)`);
  });

  test("Pointer Func complex", () => {
    const type = Type.func(Type.void(["const"]), [
      Param.char("a"),
      Param.int("b"),
    ])
      .pointer()
      .const()
      .pointer()
      .const();
    expect(type.toString()).toBe(`const void(*const*const)(char a,int b)`);
  });

  test("Array", () => {
    const type = Type.array(Type.int(), 3).pointer();
    expect(type.toString()).toBe(`int(*)[3]`);
  });

  test("Array no length", () => {
    const type = Type.array(Type.int()).pointer();
    expect(type.toString()).toBe(`int(*)[]`);
  });

  test("Pointer Array", () => {
    const type = Type.array(Type.int(), 3).pointer().pointer();
    expect(type.toString()).toBe(`int(**)[3]`);
  });

  test("Pointer Array complex", () => {
    const type = Type.array(Type.int().const(), 3)
      .pointer()
      .const()
      .pointer()
      .const();
    expect(type.toString()).toBe(`const int(*const*const)[3]`);
  });

  test("Double pointer", () => {
    const type = Type.void().pointer().pointer();
    expect(type.declare("test")).toBe(`void** test`);
  });
});
