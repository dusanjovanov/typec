import { describe, expect, test } from "bun:test";
import { Literal } from "./literal";

describe("literal", () => {
  test(`string "abc"`, () => {
    expect(Literal.string("abc")).toBe(`"abc"`);
  });

  test('string `a"b"c`', () => {
    expect(Literal.string(`a"b"c`)).toBe(`"a\"b\"c"`);
  });

  test(`char 'a'`, () => {
    expect(Literal.char("a")).toBe(`'a'`);
  });

  test(`char '\''`, () => {
    expect(Literal.char(`'`)).toBe(`'\''`);
  });

  test("unsigned 23", () => {
    expect(Literal.unsigned(23)).toBe(`23U`);
  });

  test("longInt 23", () => {
    expect(Literal.longInt(23)).toBe(`23L`);
  });

  test("unsignedLongInt 23", () => {
    expect(Literal.unsignedLongInt(23)).toBe(`23UL`);
  });

  test("longLongInt 23", () => {
    expect(Literal.longLongInt(23)).toBe(`23LL`);
  });

  test("unsignedLongLongInt 23", () => {
    expect(Literal.unsignedLongLongInt(23)).toBe(`23ULL`);
  });

  test("float 23.45", () => {
    expect(Literal.float(23.45)).toBe(`23.45F`);
  });

  test("longDouble 23.45", () => {
    expect(Literal.longDouble(23.45)).toBe(`23.45L`);
  });

  test("wideChar 'a'", () => {
    expect(Literal.wideChar("a")).toBe(`L'a'`);
  });

  test("wideChar '''", () => {
    expect(Literal.wideChar(`'`)).toBe(`L'\''`);
  });

  test("compound", () => {
    expect(Literal.compound([Literal.string("abc"), 123, "&var"])).toBe(
      `{"abc",123,&var}`
    );
  });
});
