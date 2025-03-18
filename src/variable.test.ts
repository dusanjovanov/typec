import { describe, expect, test } from "bun:test";
import { Pointer } from "./pointer";
import { Simple } from "./simple";
import { Utils } from "./utils";
import { Value } from "./value";
import { Variable } from "./variable";

describe("Variable", () => {
  test("Simple", () => {
    const varType = Simple.type("int");
    const varName = "abc";

    // constructor
    const v = Variable.new(varType, varName);
    expect(v.name).toBe(varName);
    expect(v.type).toBe(varType);
    expect(v.declare()).toBe(`int ${varName}`);

    // ref
    const refVal = v.ref();
    expect(refVal.type).toEqual(varType.pointer());
    expect(refVal.value).toEqual(`&${varName}`);

    // assignment
    const varValue = Value.int(3);
    expect(v.assign(varValue)).toBe(`${varName}=${varValue}`);
    expect(v.init(varValue)).toBe(`int ${varName}=${varValue}`);
    expect(v.minus(varValue).toString()).toBe(`${varName}-${varValue}`);
  });

  test("Pointer", () => {
    const varType = Pointer.type(Simple.type("int"));
    const varName = "abc";

    // constructor
    const v = Variable.new(varType, varName);
    expect(v.name).toBe(varName);
    expect(v.type).toBe(varType);
    expect(v.declare()).toBe(`${varType.full} ${varName}`);

    // ref
    const refVal = v.ref();
    expect(refVal.type).toEqual(varType.pointer());
    expect(refVal.value).toEqual(`&${varName}`);

    // deref
    const derefVal = v.deRef();
    expect(derefVal.type).toEqual(varType.type);
    expect(derefVal.value).toEqual(`*${varName}`);

    // assignment
    const pointerVar = Variable.pointerInt("var");
    expect(v.assign(pointerVar)).toBe(`${varName}=${pointerVar}`);
    expect(v.init(pointerVar)).toBe(`int* ${varName}=${pointerVar}`);

    // arithmetic

    // pointer - int
    const varMinus = Variable.int("var");
    const minusVal = v.minus(varMinus);
    expect(minusVal.type.full).toBe(varType.full);
    expect(minusVal.value).toBe(`${varName}-${varMinus}`);

    // pointer - pointer
    const varMinusPointer = Variable.pointerInt("var");
    const minusPointerVal = v.minus(varMinusPointer);
    expect(minusPointerVal.type.full).toBe("ptrdiff_t");
    expect(minusPointerVal.value).toBe(`${varName}-${varMinusPointer}`);
  });
});
