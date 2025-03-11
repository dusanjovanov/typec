import type {
  AutoPointerQualifier,
  AutoQualifier,
  AutoSpecifier,
} from "./types";
import { emptyFalsy, fillArray, join } from "./utils";

export const Type = {
  var(type: AutoSpecifier, qualifier?: AutoQualifier) {
    return `${emptyFalsy(qualifier, (q) => `${q} `)}${type}`;
  },
  pointer(varType: AutoSpecifier, qualifier?: AutoPointerQualifier) {
    return `${varType}*${emptyFalsy(qualifier, (q) => ` ${q}`)}`;
  },
  funcPointer(
    returnType: AutoSpecifier,
    paramTypes: AutoSpecifier[],
    level = 1
  ) {
    return `${returnType} (${join(fillArray(level, () => "*"))})(${join(
      paramTypes,
      ","
    )})`;
  },
  arr(elementType: AutoSpecifier, len: number) {
    return `${elementType} [${len}]`;
  },
  arrPointer(elementType: AutoSpecifier, len: number, level = 1) {
    return `${elementType} (${fillArray(level, () => "*")})[${len}]`;
  },
};
