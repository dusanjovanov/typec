import { describe, expect, test } from "bun:test";
import { Lit } from "./literal";
import { Op } from "./operators";
import { Type } from "./type";

const testUnaryOp = (op: string, expected: string) =>
  test(op, () => {
    expect((Op as any)[op](Type.any(), "a").toString()).toBe(expected);
  });

const testBinaryOp = (op: string, expected: string) => {
  test(op, () => {
    expect((Op as any)[op](Type.any(), "a", "b").toString()).toBe(expected);
  });
};

const testLogicalBinOp = (op: string, expected: string) => {
  test(op, () => {
    expect((Op as any)[op]("a", "b").toString()).toBe(expected);
  });
};

describe("operators", () => {
  testUnaryOp("preInc", "++a");
  testUnaryOp("postInc", "a++");
  testUnaryOp("preDec", "--a");
  testUnaryOp("postDec", "a--");

  describe("memory", () => {
    expect(Op.sizeOf("a").toString()).toBe("sizeof(a)");
    expect(Op.alignOf("a").toString()).toBe("alignof(a)");
    testUnaryOp("deRef", "*a");
    testUnaryOp("ref", "&a");
  });

  describe("bitwise", () => {
    testUnaryOp("bitNot", "~a");
    testLogicalBinOp("bitAnd", "a&b");
    testLogicalBinOp("bitOr", "a|b");
    testLogicalBinOp("bitXor", "a^b");
    testLogicalBinOp("bitLeft", "a<<b");
    testLogicalBinOp("bitRight", "a>>b");
    testBinaryOp("bitAndAssign", "a&=b");
    testBinaryOp("bitOrAssign", "a|=b");
    testBinaryOp("bitXorAssign", "a^=b");
    testBinaryOp("bitLeftAssign", "a<<=b");
    testBinaryOp("bitRightAssign", "a>>=b");
  });

  describe("logical", () => {
    expect(Op.not("a").toString()).toBe("!a");
    testLogicalBinOp("equal", "a==b");
    testLogicalBinOp("notEqual", "a!=b");
    testLogicalBinOp("gt", "a>b");
    testLogicalBinOp("lt", "a<b");
    testLogicalBinOp("gte", "a>=b");
    testLogicalBinOp("lte", "a<=b");
    testLogicalBinOp("and", "a&&b");
    testLogicalBinOp("or", "a||b");
  });

  describe("arithmetic", () => {
    testBinaryOp("plus", "a+b");
    testBinaryOp("minus", "a-b");
    testBinaryOp("div", "a/b");
    testBinaryOp("mul", "a*b");
    testBinaryOp("modulo", "a%b");
  });

  describe("asignment", () => {
    testBinaryOp("assign", "a=b");
    testBinaryOp("plusAssign", "a+=b");
    testBinaryOp("minusAssign", "a-=b");
    testBinaryOp("mulAssign", "a*=b");
    testBinaryOp("divAssign", "a/=b");
    testBinaryOp("moduloAssign", "a%=b");
  });

  test("cast", () => {
    expect(Op.cast(Type.char(), "abc").toString()).toBe(`(char)abc`);
  });

  expect(Op.dot("a", "b").toString()).toBe("a.b");
  expect(Op.arrow("a", "b").toString()).toBe("a->b");

  test("subscript", () => {
    expect(Op.subscript("arr", 3).toString()).toBe(`arr[3]`);
    expect(Op.subscript(Lit.str("abc"), 3).toString()).toBe(`"abc"[3]`);
  });

  test("ternary", () => {
    expect(Op.ternary("a>b", "a", "b").toString()).toBe(`a>b?a:b`);
  });
});
