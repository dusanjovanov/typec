import { describe, expect, test } from "bun:test";
import { Directive } from "./directive";

describe("directive", () => {
  test("includeRelative", () => {
    expect(Directive.includeRelative("abc.h")).toBe(`#include "abc.h"`);
  });

  test("includeSystem", () => {
    expect(Directive.includeSystem("string.h")).toBe(`#include <string.h>`);
  });
});
