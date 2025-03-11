import { addressOf, assign } from "./operators";
import type { AutoSpecifier, StringLike } from "./types";

export const createVar = (type: AutoSpecifier, name: string) => {
  return {
    name,
    type: type as string,
    addr: () => addressOf(name),
    assignVar: (varName: string) => {
      return assign(name, varName);
    },
    assignValue: (value: StringLike) => {
      return assign(name, value);
    },
  };
};
