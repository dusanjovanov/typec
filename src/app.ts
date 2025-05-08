import { Chunk } from "./chunk";
import { Func } from "./func";
import { type Lib, type LibSubscribeFn } from "./lib";
import { Struct } from "./struct";
import { Type } from "./type";
import type { CodeLike } from "./types";
import { unique } from "./utils";

export class App {
  constructor({ libs, main, includes = [] }: AppOptions) {
    this.libs = libs;
    this.main = main;
    this.includes = includes;
  }
  libs;
  main;
  includes;

  /** Returns the entire main .c file code in a string. */
  create() {
    const embeds: string[] = [];
    const unsubs: Function[] = [];

    const libEmbedsMap = new Map<Lib<any>, Record<string, true>>();

    this.libs.forEach((lib) => {
      if (lib.__preEmbeds) {
        embeds.push(
          ...lib.__preEmbeds.map((e) => {
            if (e instanceof Func) {
              return e.define();
            }
            //
            else if (e instanceof Struct) {
              return e.declare();
            }
            //
            else {
              return e;
            }
          })
        );
      }
      if (lib.__api) {
        libEmbedsMap.set(lib, {});
      }
      const unsub = lib.__subscribe((arg) => {
        const rec = libEmbedsMap.get(lib);
        if (rec == null) return;
        libEmbedsMap.set(lib, { ...rec, [arg.key]: true });
      });
      unsubs.push(unsub);
    });

    const mainFn = Func.new(Type.int(), "main", [], () => {
      return this.main();
    });

    const mainDef = mainFn.define();

    unsubs.forEach((fn) => fn());

    this.libs.forEach((lib) => {
      if (lib.__api == null) return;
      const rec = libEmbedsMap.get(lib);
      if (rec == null) return;
      Object.entries(lib.__api).forEach(([key, value]) => {
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
    const includes = this.includes.map((i) => i.toString());

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
};

export type AppLib = {
  __subscribe: LibSubscribeFn;
  __api: Record<string, any>;
  __preEmbeds?: any[];
};
