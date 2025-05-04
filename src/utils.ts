import { Operator } from "./operators";
import type { CodeLike } from "./types";

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

export const valueOfFull = (pointerType: string, pointerName: string) => {
  const stars = starRegex.exec(pointerType)?.[0];

  return `${stars}${pointerName}`;
};

export const getPointerTypeLevel = (pointerType: string) => {
  return starRegex.exec(pointerType)?.[0];
};

export const increasePointerTypeLevel = (pointerType: string) => {
  return pointerType.replaceAll(starRegex, (found) => {
    return found + "*";
  });
};

export const removePointerStars = (pointerType: string) => {
  return pointerType.replaceAll(starRegex, "");
};

const starRegex = /\*+/g;

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

/** Various utils that are elementary, but not part of standard C syntax. */
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
}
