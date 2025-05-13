import { describe, expect, test } from "bun:test";
import { App } from "./app";
import { Func } from "./func";

describe("App", () => {
  test("basic", () => {
    const app = App.new({
      main() {
        return [Func.return(1)];
      },
    });
    expect(app.create()).toEqual(`int main(void)\n{\nreturn 1;\n}`);
  });
});
