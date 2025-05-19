import { Func } from "./func";
import { Stat } from "./statement";
import type { StatArg } from "./types";

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

    return Stat.chunk(
      [...this.includes, ...this.embeds, mainFn].filter(
        (e) => typeof e === "object" && "kind" in e
      )
    ).toString();
  }

  static new(options: AppOptions) {
    return new App(options);
  }
}

export type AppOptions = {
  /** Add include directives. */
  includes?: string[];
  /** Embed code between include directives and the main function. */
  embeds?: (StatArg | Function)[];
  /** The app's main function */
  main: () => StatArg[];
};
