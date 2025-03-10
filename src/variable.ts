import { assign, ref } from "./operators";
import type { AutoSpecifier, StringLike } from "./types";

export const createVar = (type: AutoSpecifier, name: string) => {
  return {
    name,
    type,
    ref: ref(name),
    assignVar: (varName: string) => {
      return assign(name, varName);
    },
    assignValue: (value: StringLike) => {
      return assign(name, value);
    },
  };
};
