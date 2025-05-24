import { describe, expect, test } from "bun:test";
import { TcClass } from "./class";
import { Fn } from "./func";
import { Param } from "./param";
import { Struct } from "./struct";
import { Type } from "./type";

const struct = Struct.new("Test", {
  abc: Type.int(),
});

const fn = Fn.void("fnTest", [
  Param.structPointer(struct, "a"),
  Param.int("b"),
]);

const Cls = TcClass.new(struct, { test: fn }, { test: fn });

describe("Class", () => {
  test("var", () => {
    const v = Cls.var("test");

    expect(v.declare().toString()).toBe(`struct Test test;`);
    expect(v.init(3).toString()).toBe(`struct Test test=3;`);
    expect(v.test(3).toString()).toBe(`fnTest(&test,3)`);
  });

  test("pointer", () => {
    const p = Cls.pointer("test");

    expect(p.declare().toString()).toBe(`struct Test* test;`);
    expect(p.init(3).toString()).toBe(`struct Test* test=3;`);
    expect(p.test(3).toString()).toBe(`fnTest(test,3)`);
  });

  test("static", () => {
    expect(Cls.test(1, 2).toString()).toBe(`fnTest(1,2)`);
  });
});
