import { Func } from "./func";

/**
 * Used for defining a typec library whose code is meant to be embedded in your app's .c file.
 *
 * You can pass the object it returns into the `libs` field of the `App` class,
 * and then you get automatic ( usage based ) embedding of it's code in your app's .c file.
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
    __api: def.api,
    __preEmbeds: def.preEmbeds,
  };

  // internals
  Object.entries(def.api).forEach(([key, value]) => {
    Object.defineProperty(obj, key, {
      get() {
        subs.forEach((s) => s({ type: "internal", key, value }));
        return value;
      },
    });
  });

  return obj as unknown as Lib<T>;
};

export type LibDefinition = {
  /**
   * Used for declarations that are implemented in typec ( e.g. Funcs with a body defined ).
   *
   * These are meant to be embedded in your app's .c file, rather than included via an .h file.
   */
  api: LibApi;
  /** Things that need to be embedded. Usually declarations that are used internally. */
  preEmbeds?: any[];
};

type LibApi = Record<string, any>;

export type Lib<T extends LibDefinition> = T["api"] & {
  __subscribe: LibSubscribeFn;
  __api: Record<string, any>;
  __preEmbeds?: any[];
};

export type LibSubscribeFn = (sub: LibSubscriber) => () => void;

export type LibSubscriber = (arg: LibSubscriberArg) => void;

export type LibSubscriberArg = { type: "internal"; key: string; value: Func };
