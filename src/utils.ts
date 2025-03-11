import type { StringLike } from "./types";

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

export const join = (arr: StringLike[], sep = " ") => {
  return arr.filter((v) => v != null).join(sep);
};

export const joinWithPrefix = (
  arr: StringLike[],
  prefix: string,
  sep = " "
) => {
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

export const str = (s: string) => `"${s.replaceAll(/"/g, `\\"`)}"`;

export const pointerStars = (level = 1) => {
  return join(fillArray(level, () => "*"));
};

export const joinArgs = (args: StringLike[]) => {
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
