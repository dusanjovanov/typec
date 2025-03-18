import { describe, expect, test } from "bun:test";
import { Operator } from "./operators";
import { Type } from "./type";

const testUnaryOp = (op: string, expected: string) =>
  test(op, () => {
    expect((Operator as any)[op]("a")).toBe(expected);
  });

const testBinaryOp = (op: string, expected: string) =>
  test(op, () => {
    expect((Operator as any)[op]("a", "b")).toBe(expected);
  });

describe("operators", () => {
  testUnaryOp("preInc", "++a");
  testUnaryOp("postInc", "a++");
  testUnaryOp("preDec", "--a");
  testUnaryOp("postDec", "a--");

  describe("memory", () => {
    testUnaryOp("sizeOf", "sizeof(a)");
    testUnaryOp("alignOf", "alignof(a)");
    testUnaryOp("deRef", "*a");
    testUnaryOp("ref", "&a");
  });

  describe("bitwise", () => {
    testUnaryOp("bitNot", "~a");
    testBinaryOp("bitAnd", "a&b");
    testBinaryOp("bitOr", "a|b");
    testBinaryOp("bitXor", "a^b");
    testBinaryOp("bitLeft", "a<<b");
    testBinaryOp("bitRight", "a>>b");
    testBinaryOp("bitAndAssign", "a&=b");
    testBinaryOp("bitOrAssign", "a|=b");
    testBinaryOp("bitXorAssign", "a^=b");
    testBinaryOp("bitLeftAssign", "a<<=b");
    testBinaryOp("bitRightAssign", "a>>=b");
  });

  describe("logical", () => {
    testUnaryOp("not", "!a");
    testBinaryOp("equal", "a==b");
    testBinaryOp("notEqual", "a!=b");
    testBinaryOp("greaterThan", "a>b");
    testBinaryOp("lessThan", "a<b");
    testBinaryOp("gte", "a>=b");
    testBinaryOp("lte", "a<=b");
    testBinaryOp("and", "a&&b");
    testBinaryOp("or", "a||b");
  });

  describe("arithmetic", () => {
    testBinaryOp("modulo", "a%b");
    testBinaryOp("plus", "a+b");
    testBinaryOp("minus", "a-b");
    testBinaryOp("div", "a/b");
    testBinaryOp("mult", "a*b");
  });

  describe("asignment", () => {
    testBinaryOp("assign", "a=b");
    testBinaryOp("plusAssign", "a+=b");
    testBinaryOp("minusAssign", "a-=b");
    testBinaryOp("multAssign", "a*=b");
    testBinaryOp("divAssign", "a/=b");
    testBinaryOp("moduloAssign", "a%=b");
  });

  test("cast", () => {
    expect(Operator.cast(Type.char(), "abc")).toBe(`(char)abc`);
  });

  testBinaryOp("byValue", "a.b");
  testBinaryOp("byAddress", "a->b");

  test("subscript", () => {
    expect(Operator.subscript("arr", "3")).toBe(`arr[3]`);
  });

  test("ternary", () => {
    expect(Operator.ternary("a>b", "a", "b")).toBe(`a>b?a:b`);
  });
});
