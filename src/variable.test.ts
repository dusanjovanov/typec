import { describe, expect, test } from "bun:test";
import { Type } from "./type";
import { Var } from "./variable";

describe("Variable", () => {
  test("Simple", () => {
    const varType = Type.simple("int");
    const varName = "abc";

    // constructor
    const v = Var.new(varType, varName);
    expect(v.name).toBe(varName);
    expect(v.type).toBe(varType);
    expect(v.declare()).toBe(`int ${varName}`);

    // ref
    const refVal = v.ref();
    expect(refVal.value).toEqual(`&${varName}`);

    // assignment
    const varValue = 3;
    expect(v.assign(varValue).toString()).toBe(`${varName}=${varValue}`);
    expect(v.init(varValue)).toBe(`${varType.str} ${varName}=${varValue}`);
    expect(v.minus(varValue).toString()).toBe(`${varName}-${varValue}`);
  });

  test("Pointer", () => {
    const varType = Type.ptrInt();
    const varName = "abc";

    // constructor
    const v = Var.new(varType, varName);
    expect(v.name).toBe(varName);
    expect(v.type).toBe(varType);
    expect(v.declare()).toBe(`${varType.str} ${varName}`);

    // ref
    const refVal = v.ref();
    expect(refVal.value).toEqual(`&${varName}`);

    // deref
    const derefVal = v.deRef();
    expect(derefVal.value).toEqual(`*${varName}`);

    // assignment
    const pointerVar = Var.pointerInt("var");
    expect(v.assign(pointerVar).toString()).toBe(`${varName}=${pointerVar}`);
    expect(v.init(pointerVar)).toBe(`int* ${varName}=${pointerVar}`);

    // arithmetic

    // pointer - int
    const varMinus = Var.int("var");
    const minusVal = v.minus(varMinus);
    expect(minusVal.value).toBe(`${varName}-${varMinus}`);

    // pointer - pointer
    const varMinusPointer = Var.pointerInt("var");
    const minusPointerVal = v.minus(varMinusPointer);
    expect(minusPointerVal.value).toBe(`${varName}-${varMinusPointer}`);
  });
});
