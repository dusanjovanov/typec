import { describe, expect, test } from "bun:test";
import { Val } from "./value";
import { Type } from "./type";

describe("RValue", () => {
  test("ref", () => {
    const value = Val.new(Type.any(), "test").ref();
    expect(value.toString()).toBe(`&test`);
    const valueArrow = Val.new(Type.any(), "test").arrow("member").ref();
    expect(valueArrow.toString()).toBe(`&test->member`);
  });
});
