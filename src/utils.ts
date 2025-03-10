import { block } from "./chunk";
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

export const _while = (condition: StringLike, body: string[]) => {
  return `while(${condition})${block(body)}`;
};

export const str = (s: string) => `"${s.replaceAll(/"/g, `\\"`)}"`;

// export const qualifiedType = (fullType: VariableFullType) => {
//   return `${emptyFalsy(
//     fullType.qualifiers && fullType.qualifiers.length > 0,
//     () => `${join(fullType.qualifiers!)} `
//   )}${fullType.type}`;
// };

// export const qualifiedPointerType = (fullType: PointerFullType, level = 1) => {
//   return `${qualifiedType({
//     kind: "variable",
//     type: fullType.type,
//     qualifiers: fullType.qualifiers,
//   })}${fillArray(level, () => "*")} ${emptyFalsy(
//     fullType.pointerQualifiers && fullType.pointerQualifiers.length > 0,
//     () => `${join(fullType.pointerQualifiers!)}`
//   )}`;
// };
