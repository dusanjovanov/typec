import type { Func } from "./func";

/**
 * Used for defining a typec library.
 *
 * You can use the object this returns independently, but you can also pass it into the `libs` field of the `App` class,
 * and then you get automatic ( usage based ) include directives and embedding of internals in your app's .c file.
 *
 * Accepts an object with 2 fields:
 *
 * `externals`
 *
 * Used for declarations that are implemented in a C library ( not typec ).
 *
 * Array of objects with fields:
 * - `api`: dictionary of typec constructs. (e.g. Func objects without a body defined )
 * - `include`: path of the .h file of the C library where the declarations are actually implemented in.
 *
 * `internals`
 *
 * Used for declarations that are implemented in typec ( e.g. Funcs with a body defined ).
 *
 * These are meant to be embedded in your app's .c file, rather than included via an .h file.
 */
export const lib = <const T extends LibDefinition>(def: T) => {
  const subs = new Set<LibSubscriber>();

  const obj: Record<string, any> = {
    __subscribe: (sub: LibSubscriber) => {
      subs.add(sub);
      return () => {
        subs.delete(sub);
      };
    },
  };

  // internals
  Object.entries(def.internals ?? {}).forEach(([key, value]) => {
    obj[key] = value;
    value.onCall(() => {
      subs.forEach((s) => s({ type: "internal", value }));
    });
  });

  // externals
  def.externals.forEach((incl) => {
    Object.entries(incl.api).forEach(([key, value]) => {
      obj[key] = value;
      value.onCall(() => {
        subs.forEach((s) => s({ type: "external", include: incl.include }));
      });
    });
  });

  return obj as unknown as Lib<T>;
};

export type LibDefinition = {
  /**
   * Used for declarations that are implemented in a C library ( not typec ).
   *
   * Array of objects with fields:
   * - `api`: dictionary of typec constructs. (e.g. Func objects without a body defined )
   * - `include`: path of the .h file of the C library where the declarations are actually implemented in.
   */
  externals: ExternalLibDefinition[];
  /**
   * Used for declarations that are implemented in typec ( e.g. Funcs with a body defined ).
   *
   * These are meant to be embedded in your app's .c file, rather than included via an .h file.
   */
  internals?: LibApi;
};

export type ExternalLibDefinition = {
  include: string;
  api: LibApi;
};

type LibApi = Record<string, any>;

export type Lib<T extends LibDefinition> = ApiFromExternals<T["externals"]> &
  T["internals"] & {
    __subscribe: LibSubscribeFn;
  };

export type LibSubscribeFn = (sub: LibSubscriber) => () => void;

export type LibSubscriber = (arg: LibSubscriberArg) => void;

export type LibSubscriberArg =
  | { type: "internal"; value: Func }
  | { type: "external"; include: string };

type ApiFromExternals<T extends readonly ExternalLibDefinition[]> =
  T extends readonly []
    ? {}
    : T extends readonly [
        infer First extends ExternalLibDefinition,
        ...infer Rest
      ]
    ? Rest extends readonly ExternalLibDefinition[]
      ? First["api"] & ApiFromExternals<Rest>
      : First["api"]
    : {};
