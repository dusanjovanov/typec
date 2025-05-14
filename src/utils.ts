import { Op } from "./operators";
import type { Type } from "./type";
import type {
  BoundApi,
  BoundFunc,
  CodeLike,
  GenericApi,
  GenericFunc,
  TypeArg,
} from "./types";

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
    return Op.ternary(Op.lt(left, right), left, right);
  }

  static max(left: CodeLike, right: CodeLike) {
    return Op.ternary(Op.gt(left, right), left, right);
  }

  static clamp(value: CodeLike, minVal: CodeLike, maxVal: CodeLike) {
    return Op.ternary(
      Op.lt(value, minVal),
      minVal,
      Op.ternary(Op.gt(value, maxVal), maxVal, value)
    );
  }

  /**
   * Returns a function that returns the `.call()` result for the passed Func
   * with the first parameter of the Func bound to the expression.
   */
  static bindFunc<Func extends GenericFunc>(expression: CodeLike, func: Func) {
    return ((...args: any[]) =>
      func.call(expression, ...args)) as BoundFunc<Func>;
  }

  /**
   * Same as `bindFunc`, but for multiple Funcs.
   */
  static bindFuncs<Funcs extends GenericApi>(
    expression: CodeLike,
    funcs: Funcs
  ) {
    const bound: Record<string, any> = {};
    Object.entries(funcs).forEach(([key, fn]) => {
      bound[key] = (...args: any[]) => fn.call(expression, ...args);
    });
    return bound as BoundApi<Funcs>;
  }
}

export const typeArgToType = <S extends string>(type: TypeArg<S>): Type<S> => {
  return typeof type === "object" && "kind" in type && type.kind === "type"
    ? (type as any)
    : ((type as any).type() as Type<S>);
};
