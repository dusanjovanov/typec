import { Chunk } from "./chunk";
import { Func } from "./func";
import { type Lib, type LibSubscribeFn } from "./lib";
import { Struct } from "./struct";
import { Type } from "./type";
import type { CodeLike } from "./types";
import { unique } from "./utils";

export class App {
  constructor({ libs, main, includes = [], embeds = [] }: AppOptions) {
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

    const libEmbedsMap = new Map<Lib<any>, Record<string, true>>();

    this.libs.forEach((lib) => {
      if (lib.__embeds) {
        embeds.push(
          ...lib.__embeds.map((e) => {
            if (e instanceof Func) {
              return e.define();
            }
            //
            else if (e instanceof Struct) {
              return e.declare();
            }
            //
            else {
              return "";
            }
          })
        );
      }
      if (lib.__internals) {
        libEmbedsMap.set(lib, {});
      }
      const unsub = lib.__subscribe((arg) => {
        if (arg.type === "external") {
          includes.push(arg.include);
        }
        //
        else if (lib.__internals) {
          const rec = libEmbedsMap.get(lib);
          if (rec == null) return;
          libEmbedsMap.set(lib, { ...rec, [arg.key]: true });
        }
      });
      unsubs.push(unsub);
    });

    const mainFn = Func.new(Type.int(), "main", [], () => {
      return this.main();
    });

    const mainDef = mainFn.define();

    unsubs.forEach((fn) => fn());

    this.libs.forEach((lib) => {
      if (lib.__internals == null) return;
      const rec = libEmbedsMap.get(lib);
      if (rec == null) return;
      Object.entries(lib.__internals).forEach(([key, value]) => {
        const flag = rec[key];
        if (flag !== true) return;
        if (value instanceof Func) {
          embeds.push(value.define());
        }
        //
        else if (value instanceof Struct) {
          embeds.push(value.declare());
        }
      });
    });

    // Handle manual includes and embeds
    includes.push(...this.includes.map((i) => i.toString()));
    embeds.push(...this.embeds.map((e) => e.toString()));

    return Chunk.new([
      ...unique(includes),
      ...unique(embeds),
      mainDef,
    ]).toString();
  }

  static new(options: AppOptions) {
    return new App(options);
  }
}

export type AppOptions = {
  /**
   * A list of libraries that you plan on using. Libraries need to be in the shape returned from the `lib` function also exported from typec.
   *
   * Includes and embeds are automatically added to the final code by tracking usage ( Func calls ).
   */
  libs: AppLib[];
  /** The app's main function */
  main: () => CodeLike[];
  /** To manually add include directives. */
  includes?: CodeLike[];
  /** To manually add code between the include directives and the main function. */
  embeds?: CodeLike[];
};

export type AppLib = {
  __subscribe: LibSubscribeFn;
  __internals?: Record<string, any>;
  __embeds?: any[];
};
