import { describe, expect, test } from "bun:test";
import { Value } from "./value";

describe("RValue", () => {
  test("ref", () => {
    const value = Value.new("test").ref();
    expect(value.toString()).toBe(`&test`);
    const valueArrow = Value.new("test").arrow("member").ref();
    expect(valueArrow.toString()).toBe(`&test->member`);
  });
});
