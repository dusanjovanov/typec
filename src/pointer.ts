import { assign, valueOf } from "./operators";
import type { AutoSpecifier } from "./types";

export const createPointer = (type: AutoSpecifier, name: string) => {
  return {
    name,
    type,
    value: () => valueOf(name),
    assignPointer: (pointerName: string) => {
      return assign(name, pointerName);
    },
    assignAddress: (address: string) => {
      return assign(name, address);
    },
  };
};
