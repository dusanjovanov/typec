import { assign, value } from "./operators";
import type { AutoSpecifier } from "./types";

export const createPointer = (type: AutoSpecifier, name: string) => {
  return {
    name,
    type,
    value: value(name),
    assignRef: (ref: string) => {
      return assign(name, ref);
    },
  };
};
