import { addressOf, assign, valueOf } from "./operators";
import { Type } from "./type";
import type { AutoSpecifier, StringLike } from "./types";
import { fillArray, join } from "./utils";

export const arr = (elementType: AutoSpecifier, name: string, len: number) => {
  const type = Type.arr(elementType, len);

  return {
    declare: () => `${elementType} ${name}[${len}]`,
    init: (value: StringLike[]) =>
      assign(`${elementType} ${name}[]`, `{${join(value, ",")}}`),
    name,
    type: elementType,
    ref: addressOf(name),
    pointer: (pointerName: string, len: number) => {
      return arrPointer(elementType, pointerName, len);
    },
    pointerElement: (pointerName: string) => {
      return pointer(elementType, pointerName);
    },
  };
};

export const arrPointerType = (
  elementType: AutoSpecifier,
  len: number,
  level = 1
) => {
  return `${elementType} (${fillArray(level, () => "*")})[${len}]`;
};

export const arrPointerDeclare = (
  elementType: AutoSpecifier,
  name: string,
  len: number,
  level = 1
) => {
  return `${elementType} (${fillArray(level, () => "*")}${name})[${len}]`;
};

export const arrPointerInit = (
  elementType: AutoSpecifier,
  name: string,
  len: number,
  arrRef: string,
  level = 1
) => {
  return assign(arrPointerDeclare(elementType, name, len, level), arrRef);
};

export const arrPointer = (
  elementType: AutoSpecifier,
  name: string,
  len: number,
  level = 1
) => {
  return {
    declare: arrPointerDeclare(elementType, name, len, level),
    init: (arrRef: string) => {
      return arrPointerInit(elementType, name, len, arrRef, level);
    },
    name,
    type: arrPointerType(elementType, len, level),
    value: valueOf(name),
    len,
    level,
  };
};
