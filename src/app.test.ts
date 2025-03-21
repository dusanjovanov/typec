import { describe, expect, test } from "bun:test";
import { App } from "./app";
import { Lit } from "./literal";
import { stdio } from "./std";

describe("App", () => {
  test("simple", () => {
    const app = App.new({
      libs: { stdio },
      main({ libs: { stdio } }) {
        return [stdio.puts.call(Lit.string("abc"))];
      },
    });
    expect(app.create()).toBe(
      `#include <stdio.h>\nint main(void)\n{\nputs("abc");\n}`
    );
  });
});
