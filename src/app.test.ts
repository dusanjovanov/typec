import { describe, expect, test } from "bun:test";
import { App } from "./app";
import { Directive } from "./directive";
import { _ } from "./short";

describe("App", () => {
  test("basic", () => {
    const app = App.new({
      includes: [Directive.includeSys("stdio.h")],
      main() {
        return [_.return(1)];
      },
    });
    expect(app.create()).toEqual(
      `#include <stdio.h>\nint main(void)\n{\nreturn 1;\n}`
    );
  });
});
