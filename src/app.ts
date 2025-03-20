import { Chunk } from "./chunk";
import { Func } from "./func";
import { Type } from "./type";
import type { CodeLike } from "./types";

export class App {
  constructor({ includes, main }: AppOptions) {
    this.includes = includes;
    this.main = main;
  }
  includes;
  main;

  create() {
    const mainFn = Func.new(Type.int(), "main", [], () => {
      return this.main();
    });

    return Chunk.new([...this.includes, mainFn.define()]);
  }

  static new(options: AppOptions) {
    return new App(options);
  }
}

type AppOptions = {
  includes: CodeLike[];
  main: () => CodeLike[];
};
