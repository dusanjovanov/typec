import { describe, expect, test } from "bun:test";
import { Lit } from "./literal";

describe("literal", () => {
  test(`string "abc"`, () => {
    expect(Lit.str("abc").toString()).toBe(`"abc"`);
  });

  test('string `a"b"c`', () => {
    expect(Lit.str(`a"b"c`).toString()).toBe(`"a\\"b\\"c"`);
  });

  test(`char 'a'`, () => {
    expect(Lit.char("a")).toBe(`'a'`);
  });

  test(`char '\''`, () => {
    expect(Lit.char(`'`)).toBe(`'\\''`);
  });

  test("unsigned 23", () => {
    expect(Lit.unsigned(23)).toBe(`23U`);
  });

  test("longInt 23", () => {
    expect(Lit.longInt(23)).toBe(`23L`);
  });

  test("unsignedLongInt 23", () => {
    expect(Lit.unsignedLongInt(23)).toBe(`23UL`);
  });

  test("longLongInt 23", () => {
    expect(Lit.longLongInt(23)).toBe(`23LL`);
  });

  test("unsignedLongLongInt 23", () => {
    expect(Lit.unsignedLongLongInt(23)).toBe(`23ULL`);
  });

  test("float 23.45", () => {
    expect(Lit.float(23.45)).toBe(`23.45f`);
  });

  test("longDouble 23.45", () => {
    expect(Lit.longDouble(23.45)).toBe(`23.45L`);
  });

  test("wideChar 'a'", () => {
    expect(Lit.wideChar("a")).toBe(`L'a'`);
  });

  test("wideChar '''", () => {
    expect(Lit.wideChar(`'`)).toBe(`L'\\''`);
  });

  test("compound", () => {
    expect(Lit.compound(Lit.str("abc"), 123, "&var")).toBe(`{"abc",123,&var}`);
  });

  test("simpleMember", () => {
    expect(Lit.singleMemberInit(123)).toBe(`{123}`);
    expect(Lit.singleMemberInit(Lit.str("abc"))).toBe(`{"abc"}`);
  });
});
