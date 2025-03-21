import { Chunk } from "./chunk";
import { Func } from "./func";
import { Type } from "./type";
import type { CodeLike } from "./types";
import { unique } from "./utils";

export class App {
  constructor({ includes = [], embeds = [], main }: AppOptions) {
    this.includes = includes;
    this.embeds = embeds;
    this.main = main;
  }
  includes;
  embeds;
  main;

  /** Returns the entire main .c file code in a string. */
  create() {
    const mainFn = Func.new(Type.int(), "main", [], () => {
      return this.main?.() ?? [];
    });

    const includes = unique(this.includes.map((e) => e.toString()));
    const embeds = unique(this.embeds.map((e) => e.toString()));

    return Chunk.new([...includes, ...embeds, mainFn.define()]).toString();
  }

  static new(options: AppOptions) {
    return new App(options);
  }
}

type AppOptions = {
  /** Include directives */
  includes?: CodeLike[];
  /** Anything between include directives and the main function */
  embeds?: CodeLike[];
  /** The app's main function */
  main?: () => CodeLike[];
};
