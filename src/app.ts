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
  main;
  embeds;
  includes;

  /** Returns the entire main .c file code in a string. */
  create() {
    const mainFn = Func.new(Type.int(), "main", [], () => {
      return this.main();
    });

    const mainDef = mainFn.define();

    return Chunk.new(
      ...unique(this.includes.map((i) => i.toString())),
      ...unique(
        this.embeds
          .filter((e) => {
            return (
              typeof e === "object" &&
              "embed" in e &&
              typeof e.embed === "function"
            );
          })
          .map((e) => {
            // @ts-ignore
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
  /** To manually add include directives. */
  includes?: CodeLike[];
  embeds?: CodeLike[];
  /** The app's main function */
  main: () => CodeLike[];
};
