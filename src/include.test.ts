import { describe, test, expect } from "bun:test";
import { Include } from "./include";

describe("include", () => {
  test("relative", () => {
    expect(Include.relative("abc.h")).toBe(`#include "abc.h"`);
  });

  test("system", () => {
    expect(Include.system("string.h")).toBe(`#include <string.h>`);
  });
});
