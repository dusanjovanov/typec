import { describe, expect, test } from "bun:test";
import { Directive } from "./directive";

describe("directive", () => {
  test("includeRelative", () => {
    expect(Directive.includeRel("abc.h")).toBe(`#include "abc.h"`);
  });

  test("includeSystem", () => {
    expect(Directive.includeSys("string.h")).toBe(`#include <string.h>`);
  });
});
