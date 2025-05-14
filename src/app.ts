import { Chunk } from "./chunk";
import { Func } from "./func";
import type { CodeLike, Embeddable } from "./types";
import { unique } from "./utils";

export class App {
  constructor({ includes = [], embeds = [], main }: AppOptions) {
    this.includes = includes;
    this.embeds = embeds;
    this.main = main;
  }
  main;
  embeds;
  includes;

  /** Returns the entire main .c file code in a string. */
  create() {
    const mainFn = Func.int("main", [], () => {
      return this.main();
    });

    const mainDef = mainFn.define();

    return Chunk.new(
      ...unique(this.includes.map((i) => i.toString())),
      ...unique(
        this.embeds.map((e) => {
          return e.embed();
        })
      ),
      mainDef
    ).toString();
  }

  static new(options: AppOptions) {
    return new App(options);
  }
}

export type AppOptions = {
  /** Add include directives. */
  includes?: CodeLike[];
  /** Embed code between include directives and the main function. */
  embeds?: Embeddable[];
  /** The app's main function */
  main: () => CodeLike[];
};
