import { assign, ref, value } from "./operators";
import { pointer } from "./pointer";
import type { AutocompletedCType, StringLike } from "./types";
import { fillArray, join } from "./utils";

export const arrType = (
  elementType: AutocompletedCType,
  name: string,
  len: number
) => {
  return `${elementType} ${name}[${len}]`;
};

export const arrDeclare = (
  elementType: AutocompletedCType,
  name: string,
  len: number
) => {
  return arrType(elementType, name, len);
};

export const arrInit = (
  elementType: AutocompletedCType,
  name: string,
  values: StringLike[]
) => {
  return assign(`${elementType} ${name}[]`, `{${join(values, ",")}}`);
};

export const arr = (elementType: AutocompletedCType, name: string) => {
  return {
    declare: (len: number) => arrDeclare(elementType, name, len),
    init: (value: StringLike[]) => arrInit(elementType, name, value),
    name,
    type: elementType,
    ref: ref(name),
    pointer: (pointerName: string, len: number) => {
      return arrPointer(elementType, pointerName, len);
    },
    pointerElement: (pointerName: string) => {
      return pointer(elementType, pointerName);
    },
  };
};

export const arrPointerType = (
  elementType: AutocompletedCType,
  len: number,
  level = 1
) => {
  return `${elementType} (${fillArray(level, () => "*")})[${len}]`;
};

export const arrPointerDeclare = (
  elementType: AutocompletedCType,
  name: string,
  len: number,
  level = 1
) => {
  return `${elementType} (${fillArray(level, () => "*")}${name})[${len}]`;
};

export const arrPointerInit = (
  elementType: AutocompletedCType,
  name: string,
  len: number,
  arrRef: string,
  level = 1
) => {
  return assign(arrPointerDeclare(elementType, name, len, level), arrRef);
};

export const arrPointer = (
  elementType: AutocompletedCType,
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
    value: value(name),
    len,
    level,
  };
};
