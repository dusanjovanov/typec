import { block } from "./chunk";
import type { AutocompletedCType, TextLike } from "./types";

/**
 * Returns an empty string when the value is falsy.
 * You can pass a format function to transform the truthy value.
 * If the format function is not passed the truthy value itself is returned.
 */
export const emptyFalsy = <T>(
  text: T | null | undefined | boolean,
  format?: (str: T) => string
) => {
  return text != null && text !== false
    ? format
      ? format(text as T)
      : String(text)
    : "";
};

export const join = (arr: TextLike[], sep = " ") => {
  return arr.filter(Boolean).join(sep);
};

export const joinWithPrefix = (arr: TextLike[], prefix: string, sep = " ") => {
  return join(
    arr.map((e) => `${prefix}${e}`),
    sep
  );
};

/** Return statement */
export const _return = (value: TextLike) => `return ${value};`;

/**
 * Returns a while loop statement.
 */
export const _while = (condition: TextLike, body: string[]) => {
  return `while(${condition})${block(body)}`;
};

/**
 * Returns a string meant to be used as a string literal in c code.
 *
 * Surrounds the string with quotes and automatically escapes all quotes inside of the string.
 */
export const str = (s: string) => `"${s.replaceAll(/"/g, `\\"`)}"`;

/**
 * Returns a type cast expression.
 */
export const cast = (type: AutocompletedCType, exp: string) => {
  return `(${type})(${exp})`;
};

export const argsWithVarArgs = (startArgs: TextLike[], varArgs: TextLike[]) => {
  const _args = [...startArgs];
  if (varArgs.length > 0) {
    _args.push(...varArgs);
  }
  return _args;
};
