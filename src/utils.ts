import type { Func } from "./func";
import { Operator } from "./operators";
import type { Param } from "./param";
import type { CodeLike, FuncArgsFromParams } from "./types";

/**
 * Returns an empty string when the value is falsy or an empty array.
 * You can pass a format function to transform the truthy value.
 * If the format function is not passed the truthy value itself is returned.
 */
export const emptyFalsy = <T>(
  value: T | null | undefined | boolean,
  format?: (str: T) => string
) => {
  const isEmpty =
    value == null ||
    value === false ||
    (Array.isArray(value) && value.length === 0) ||
    value === "";

  if (isEmpty) return "";

  return format ? format(value as T) : String(value);
};

export const emptyNotFalse = <T>(
  value: T | null | undefined | boolean,
  format?: (str: T) => string
) => {
  const isEmpty =
    value == null ||
    (Array.isArray(value) && value.length === 0) ||
    value === "";

  if (isEmpty) return "";

  return format ? format(value as T) : String(value);
};

export const join = (arr: CodeLike[], sep = " ") => {
  return arr.filter((v) => v != null).join(sep);
};

export const joinWithPrefix = (arr: CodeLike[], prefix: string, sep = " ") => {
  return join(
    arr.map((e) => `${prefix}${e}`),
    sep
  );
};

export const fillArray = <T>(
  length: number,
  callback: (index: number) => T
) => {
  return Array.from({ length }).map((_, index) => callback(index));
};

export const pointerStars = (level = 1) => {
  return join(fillArray(level, () => "*"));
};

export const joinArgs = (args: CodeLike[]) => {
  return join(args, ",");
};

export const stringSplice = (
  str: string,
  offset: number,
  strToInsert: string,
  removeCount = 0
) => {
  let calculatedOffset = offset < 0 ? str.length + offset : offset;
  return (
    str.substring(0, calculatedOffset) +
    strToInsert +
    str.substring(calculatedOffset + removeCount)
  );
};

export const unique = <T>(arr: T[]) => {
  return Array.from(new Set(arr));
};

/** Various useful utils. */
export class Utils {
  static min(left: CodeLike, right: CodeLike) {
    return Operator.ternary(Operator.lt(left, right), left, right);
  }

  static max(left: CodeLike, right: CodeLike) {
    return Operator.ternary(Operator.gt(left, right), left, right);
  }

  static clamp(value: CodeLike, minVal: CodeLike, maxVal: CodeLike) {
    return Operator.ternary(
      Operator.lt(value, minVal),
      minVal,
      Operator.ternary(Operator.gt(value, maxVal), maxVal, value)
    );
  }

  /**
   * Takes in an expression and a dictionary of Func objects
   * and returns corresponding functions that return the `.call()` result
   * with the first parameter of all the Funcs bound to the expression.
   */
  static bindFuncs<Funcs extends Record<string, Func<any, any>>>(
    expression: CodeLike,
    funcs: Funcs
  ) {
    const bound: Record<string, any> = {};
    Object.entries(funcs).forEach(([key, fn]) => {
      bound[key] = (...args: any[]) => fn.call(expression, ...args);
    });
    return bound as {
      [key in keyof Funcs]: (...args: BoundArgs<Funcs[key]["_params"]>) => void;
    };
  }
}

type BoundArgs<T extends readonly Param[]> = T extends readonly [
  infer _ extends Param,
  ...infer Rest extends readonly Param[]
]
  ? FuncArgsFromParams<Rest>
  : [];
