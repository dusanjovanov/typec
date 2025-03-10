import type {
  AutoPointerQualifier,
  AutoQualifier,
  AutoSpecifier,
} from "./types";
import { emptyFalsy } from "./utils";

export const Type = {
  var(type: AutoSpecifier, qualifier?: AutoQualifier) {
    return `${emptyFalsy(qualifier, (q) => `${q} `)}${type}`;
  },
  pointer(type: AutoSpecifier, qualifier?: AutoPointerQualifier) {
    return `${type}${emptyFalsy(qualifier, (q) => ` ${q}`)}`;
  },
  struct(name: string, qualifier?: AutoQualifier) {
    return Type.var(`struct ${name}`, qualifier);
  },
  structPointer(name: string, qualifer?: AutoPointerQualifier) {
    return Type.pointer(`struct ${name}`, qualifer);
  },
};
