import { ref, assign } from "./operators";
import { pointer } from "./pointer";
import type { AutocompletedCType, StringLike } from "./types";

export const varDeclare = (type: AutocompletedCType, name: string) => {
  return `${type} ${name}`;
};

export const varInit = (
  type: AutocompletedCType,
  name: string,
  value: StringLike
) => {
  return assign(varDeclare(type, name), value);
};

export const variable = (type: AutocompletedCType, name: string) => {
  return {
    declare: varDeclare(type, name),
    init: (value: StringLike) => varInit(type, name, value),
    name,
    type,
    ref: ref(name),
    assign: (value: StringLike) => {
      return assign(name, value);
    },
    pointer: (name: string) => {
      return pointer(type, name);
    },
  };
};
