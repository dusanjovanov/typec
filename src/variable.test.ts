import { describe, expect, test } from "bun:test";
import { Type } from "./type";
import { Var } from "./variable";
import { Struct } from "./struct";

describe("Variable", () => {
  test("Simple", () => {
    const varType = Type.simple("int");
    const varName = "abc";

    // constructor
    const v = Var.new(varType, varName);
    expect(v.name).toBe(varName);
    expect(v.type).toBe(varType);
    expect(v.declare().toString()).toBe(`int ${varName};`);

    // ref
    const refVal = v.ref();
    expect(refVal.toString()).toEqual(`&${varName}`);

    // assignment
    const varValue = 3;
    expect(v.set(varValue).toString()).toBe(`${varName}=${varValue}`);
    expect(v.init(varValue).toString()).toBe(
      `${varType.str} ${varName}=${varValue};`
    );
    expect(v.minus(varValue).toString()).toBe(`${varName}-${varValue}`);
  });

  test("Pointer", () => {
    const varType = Type.int().pointer();
    const varName = "abc";

    // constructor
    const v = Var.new(varType, varName);
    expect(v.name).toBe(varName);
    expect(v.type).toBe(varType);
    expect(v.declare().toString()).toBe(`${varType.str} ${varName};`);

    // ref
    const refVal = v.ref();
    expect(refVal.toString()).toEqual(`&${varName}`);

    // deref
    const derefVal = v.deRef();
    expect(derefVal.toString()).toEqual(`*${varName}`);

    // assignment
    const pointerVar = Var.new(Type.int().pointer(), "var");
    expect(v.set(pointerVar).toString()).toBe(`${varName}=${pointerVar}`);
    expect(v.init(pointerVar).toString()).toBe(
      `int* ${varName}=${pointerVar};`
    );

    // arithmetic

    // pointer - int
    const varMinus = Var.int("var");
    const minusVal = v.minus(varMinus);
    expect(minusVal.toString()).toBe(`${varName}-${varMinus}`);

    // pointer - pointer
    const varMinusPointer = Var.new(Type.int().pointer(), "var");
    const minusPointerVal = v.minus(varMinusPointer);
    expect(minusPointerVal.toString()).toBe(`${varName}-${varMinusPointer}`);
  });

  test("struct", () => {
    const struct = Struct.new("Test", {
      a: Type.int(),
    });

    const v = Var.struct(struct, "test");

    expect(v.declare().toString()).toBe(`struct Test test;`);
    expect(v.a.toString()).toBe(`test.a`);
  });

  test("struct pointer", () => {
    const struct = Struct.new("Test", {
      a: Type.int(),
    });

    const v = Var.structPointer(struct, "test");

    expect(v.declare().toString()).toBe(`struct Test* test;`);
    expect(v.a.toString()).toBe(`test->a`);
  });
});
