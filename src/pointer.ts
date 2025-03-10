import { ref, assign, value } from "./operators";
import type { AutocompletedCType } from "./types";
import { fillArray, join } from "./utils";

export const pointerType = (type: AutocompletedCType, level = 1) => {
  return `${type}${join(fillArray(level, () => "*"))}`;
};

export const pointerDeclare = (
  type: AutocompletedCType,
  name: string,
  level = 1
) => {
  return `${pointerType(type, level)} ${name}`;
};

export const pointerInit = (
  type: AutocompletedCType,
  name: string,
  ref: string,
  level = 1
) => {
  return assign(pointerDeclare(type, name, level), ref);
};

export const pointer = (type: AutocompletedCType, name: string, level = 1) => {
  return {
    declare: pointerDeclare(type, name, level),
    init: (ref: string) => pointerInit(type, name, ref, level),
    name,
    type: pointerType(type, level),
    ref: ref(name),
    level,
    assign: (ref: string) => {
      return assign(name, ref);
    },
    pointer: (type: AutocompletedCType, name: string) => {
      return pointer(type, name, level + 1);
    },
    value: value(name),
  };
};
