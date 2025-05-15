import { describe, test, expect } from "bun:test";
import { Loop } from "./loops";

describe("Loop", () => {
  test("while basic", () => {
    expect(Loop.while("abc", ['printf("hey")'])).toBe(
      `while(abc)\n{\nprintf("hey");\n}`
    );
  });
});
