import { describe, expect, test } from "bun:test";
import { Func } from "./func";
import { Par } from "./param";
import { Type } from "./type";

describe("Func", () => {
  test("simple", () => {
    const fn = Func.new(
      Type.int(),
      "sum",
      [Par.int("a"), Par.int("b")],
      ({ params }) => {
        return [params.a.plus(params.b).return()];
      }
    );
    expect(fn.declare()).toBe(`int sum(int a,int b)`);
    expect(fn.define()).toBe(`int sum(int a,int b)\n{\nreturn a+b;\n}`);
    expect(fn.call(2, 2).toString()).toBe(`sum(2,2)`);
  });
});
