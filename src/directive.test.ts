import { describe, expect, test } from "bun:test";
import { Dir } from "./directive";

describe("directive", () => {
  test("includeRelative", () => {
    expect(Dir.includeRel("abc.h")).toBe(`#include "abc.h"`);
  });

  test("includeSystem", () => {
    expect(Dir.includeSys("string.h")).toBe(`#include <string.h>`);
  });
});
