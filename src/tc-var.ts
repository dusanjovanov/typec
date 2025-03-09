import type { AutocompletedCType, TextLike } from "./types";
import { emptyFalsy, join } from "./utils";

/** Returns a variable declaration statement and optionally an assignment. */
export const _var = (
  type: AutocompletedCType,
  name: string,
  assign?: TextLike
) => {
  return `${type} ${name}${emptyFalsy(assign, (s) => ` = ${s}`)}`;
};

/**
 * Returns an array variable declaration without initialization.
 */
export const arrVar = (type: AutocompletedCType, name: string, len: number) => {
  return _var(type, `${name}[${len}]`);
};

/**
 * Returns an array variable declaration with initialization.
 */
export const arrInit = (
  type: AutocompletedCType,
  name: string,
  values: TextLike[]
) => {
  return _var(type, `${name}[]`, `{${join(values, ",")}}`);
};
