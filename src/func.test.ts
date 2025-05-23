import { describe, expect, test } from "bun:test";
import { Fn } from "./func";
import { Param } from "./param";
import { Type } from "./type";

describe("Func", () => {
  test("simple", () => {
    const fn = Fn.new(
      Type.int(),
      "sum",
      [Param.int("a"), Param.int("b")],
      ({ params }) => {
        return [params.a.plus(params.b).return()];
      }
    );
    expect(fn.declare().toString()).toBe(`int sum(int a,int b)`);
    expect(fn.define().toString()).toBe(
      `int sum(int a,int b)\n{\nreturn a+b;\n}`
    );
    expect(fn(2, 2).toString()).toBe(`sum(2,2)`);
  });
});
