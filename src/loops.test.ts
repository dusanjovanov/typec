import { describe, expect, test } from "bun:test";
import { Loop } from "./loops";
import { Val } from "./val";

describe("Loop", () => {
  test("while basic", () => {
    expect(Loop.while("abc", [Val.int(3)]).toString()).toBe(
      `while(abc)\n{\n3;\n}`
    );
  });
});
