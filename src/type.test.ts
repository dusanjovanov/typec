import { describe, expect, test } from "bun:test";
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
] as const satisfies SimpleType[];

describe("Simple", () => {
  types.forEach((type) => {
    test(type, () => {
      const _type = Type.simple(type);
      if (_type.desc.kind === "simple") {
        expect(_type.str).toBe(type);
      } else throw Error();
    });
    test(`const ${type}`, () => {
      const _type = Type.simple(type, ["const"]);
      if (_type.desc.kind === "simple") {
        expect(_type.str).toBe(`const ${type}`);
      } else throw Error();
    });
    test(`const volatile ${type}`, () => {
      const _type = Type.simple(type, ["const", "volatile"]);
      if (_type.desc.kind === "simple") {
        expect(_type.str).toBe(`const volatile ${type}`);
      } else throw Error();
    });
  });
});

typesWithShortcuts.forEach((type) => {
  describe(`Type.${type}`, () => {
    test(type, () => {
      const _type = Type[type]();
      if (_type.desc.kind === "simple") {
        expect(_type.str).toBe(type);
      } else throw Error();
    });
    test(`const ${type}`, () => {
      const _type = Type[type](["const"]);
      if (_type.desc.kind === "simple") {
        expect(_type.str).toBe(`const ${type}`);
      } else throw Error();
    });
    test(`const volatile ${type}`, () => {
      const _type = Type[type](["const", "volatile"]);
      if (_type.desc.kind === "simple") {
        expect(_type.str).toBe(`const volatile ${type}`);
      } else throw Error();
    });
  });
});

describe("Array", () => {
  test("Simple element", () => {
    const type = Type.array(Type.int(), 3);
    if (type.desc.kind === "array") {
      expect(type.str).toBe(`int [3]`);
    }
  });
  test("Pointer element", () => {
    const type = Type.array(Type.pointer(Type.int()), 3);
    if (type.desc.kind === "array") {
      expect(type.str).toBe(`int* [3]`);
    }
  });
});

describe("Func", () => {
  test("Simple", () => {
    const type = Type.func(Type.void(), [Type.char(), Type.int()]);
    if (type.desc.kind === "func") {
      expect(type.str).toBe(`void (char,int)`);
    } else throw Error();
  });
  test("Simple complex", () => {
    const type = Type.func(Type.void(["const"]), [
      Type.char(["const"]),
      Type.int(["const"]),
    ]);
    if (type.desc.kind === "func") {
      expect(type.str).toBe(`const void (const char,const int)`);
    } else throw Error();
  });
  test("Func with pointers complex", () => {
    const _t = Type.func(Type.pointer(Type.void(["const"]), ["const"]), [
      Type.pointer(Type.char(["const"]), ["const"]),
      Type.pointer(Type.int(["const"]), ["const"]),
    ]);
    if (_t.desc.kind === "func") {
      expect(_t.str).toBe(
        `const void* const (const char* const,const int* const)`
      );
    } else throw Error();
  });
});

describe("Struct", () => {
  test("simple", () => {
    const type = Type.struct("Test");
    expect(type.str).toBe(`Test`);
  });
  test("const", () => {
    const type = Type.struct("Test", ["const"]);
    expect(type.str).toBe(`const Test`);
  });
});

describe("Union", () => {
  test("simple", () => {
    const type = Type.union("Test");
    expect(type.str).toBe(`Test`);
  });
  test("const", () => {
    const type = Type.union("Test", ["const"]);
    expect(type.str).toBe(`const Test`);
  });
});

describe("Pointer", () => {
  test("Struct", () => {
    const type = Type.pointer(Type.struct("abc"));
    if (type.desc.kind === "pointer") {
      expect(type.str).toBe(`abc*`);
    } else throw Error();
  });
  test("Struct complex", () => {
    const type = Type.pointer(Type.struct("abc", ["const"]), ["const"]);
    if (type.desc.kind === "pointer") {
      expect(type.str).toBe(`const abc* const`);
    } else throw Error();
  });
  test("Func", () => {
    const type = Type.pointer(
      Type.func(Type.void(), [Type.char(), Type.int()])
    );
    if (type.desc.kind === "pointer") {
      expect(type.str).toBe(`void (*)(char,int)`);
    } else throw Error();
  });
  test("Pointer Func", () => {
    const type = Type.pointer(
      Type.pointer(Type.func(Type.void(), [Type.char(), Type.int()]))
    );
    if (type.desc.kind === "pointer") {
      expect(type.str).toBe(`void (**)(char,int)`);
    } else throw Error();
  });
  test("Pointer Func complex", () => {
    const type = Type.pointer(
      Type.pointer(Type.func(Type.void(["const"]), [Type.char(), Type.int()]), [
        "const",
      ]),
      ["const"]
    );
    if (type.desc.kind === "pointer") {
      expect(type.str).toBe(`const void (*const*const)(char,int)`);
    } else throw Error();
  });
  test("Array", () => {
    const type = Type.pointer(Type.array(Type.int(), 3));
    if (type.desc.kind === "pointer") {
      expect(type.str).toBe(`int (*)[3]`);
    } else throw Error();
  });

  test("Pointer Array", () => {
    const type = Type.pointer(Type.pointer(Type.array(Type.int(), 3)));
    if (type.desc.kind === "pointer") {
      expect(type.str).toBe(`int (**)[3]`);
    } else throw Error();
  });

  test("Pointer Array complex", () => {
    const type = Type.pointer(
      Type.pointer(Type.array(Type.int(["const"]), 3), ["const"]),
      ["const"]
    );
    if (type.desc.kind === "pointer") {
      expect(type.str).toBe(`const int (*const*const)[3]`);
    } else throw Error();
  });
});
