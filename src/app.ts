import { Chunk } from "./chunk";
import { Func } from "./func";
import type { Lib, LibSubscriberArg } from "./lib";
import { Type } from "./type";
import type { CodeLike } from "./types";
import { unique } from "./utils";

export class App<Libs extends Record<string, Lib>> {
  constructor({ libs, main, includes = [], embeds = [] }: AppOptions<Libs>) {
    this.libs = libs;
    this.main = main;
    this.includes = includes;
    this.embeds = embeds;
  }
  libs;
  main;
  includes;
  embeds;

  /** Returns the entire main .c file code in a string. */
  create() {
    const includes: string[] = [];
    const embeds: string[] = [];
    const unsubs: Function[] = [];

    Object.values(this.libs).forEach((lib) => {
      const unsub = lib.__subscribe((arg: LibSubscriberArg) => {
        if (arg.type === "external") {
          includes.push(arg.include);
        }
        //
        else {
          embeds.push(arg.value.define());
        }
      });
      unsubs.push(unsub);
    });

    const mainFn = Func.new(Type.int(), "main", [], () => {
      return this.main({ libs: this.libs });
    });

    const mainDef = mainFn.define();

    unsubs.forEach((fn) => fn());

    // Handle manual includes and embeds
    includes.push(...this.includes.map((i) => i.toString()));
    embeds.push(...this.embeds.map((e) => e.toString()));

    return Chunk.new([
      ...unique(includes),
      ...unique(embeds),
      mainDef,
    ]).toString();
  }

  static new<Libs extends Record<string, Lib>>(options: AppOptions<Libs>) {
    return new App(options);
  }
}

export type AppOptions<Libs extends Record<string, Lib>> = {
  /**
   * A dictionary of libraries that you plan on using. Libraries need to be in the shape returned from the `lib` function also exported from typec.
   *
   * Includes and embeds are automatically added to the final code by tracking usage ( Func calls ).
   */
  libs: Libs;
  /** The app's main function */
  main: (arg: { libs: Libs }) => CodeLike[];
  /** To manually add include directives. */
  includes?: CodeLike[];
  /** To manually add code between the include directives and the main function. */
  embeds?: CodeLike[];
};
