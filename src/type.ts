import type {
  AutoPointerQualifier,
  AutoQualifier,
  AutoSpecifier,
  Qualifier,
} from "./types";
import { emptyFalsy, joinArgs, pointerStars } from "./utils";

export const Type = {
  /** Any simple non-pointer type */
  var(type: AutoSpecifier, qualifier?: AutoQualifier) {
    return `${emptyFalsy(qualifier, (q) => `${q} `)}${type}`;
  },
  /** Any simple pointer type */
  pointer(varType: AutoSpecifier, qualifier?: AutoPointerQualifier) {
    return `${varType}*${emptyFalsy(qualifier, (q) => ` ${q}`)}`;
  },
  /** Like var, but with const qualifier built-in */
  const(type: AutoSpecifier, qualifier?: AutoQualifier) {
    return Type.var(type, `const${emptyFalsy(qualifier, (q) => ` ${q}`)}`);
  },
  /** Like pointer, but with const qualifier built-in */
  constPointer(varType: AutoSpecifier, qualifier?: AutoPointerQualifier) {
    return Type.pointer(
      varType,
      `const${emptyFalsy(qualifier, (q) => ` ${q}`)}`
    );
  },
  /** Entire type of a function */
  func(returnType: AutoSpecifier, paramTypes: AutoSpecifier[]) {
    return `${returnType} (${joinArgs(paramTypes)})`;
  },
  /** Type of a pointer to a function */
  funcPointer(
    returnType: AutoSpecifier,
    paramTypes: AutoSpecifier[],
    qualifier?: AutoPointerQualifier,
    level = 1
  ) {
    return `${returnType} (${pointerStars(level)}${emptyFalsy(
      qualifier,
      (q) => ` ${q}`
    )})(${joinArgs(paramTypes)})`;
  },
  /** Type of an entire array */
  arr(elementType: AutoSpecifier, len: number, qualifier?: Qualifier) {
    return `${emptyFalsy(qualifier, (q) => `${q} `)}${elementType} [${len}]`;
  },
  /** Type of a pointer to an entire array */
  arrPointer(
    elementType: AutoSpecifier,
    len: number,
    qualifier?: AutoPointerQualifier,
    level = 1
  ) {
    return `${elementType} (${pointerStars(level)}${emptyFalsy(
      qualifier,
      (q) => ` ${q}`
    )})[${len}]`;
  },
  /** Type of a struct instance */
  struct(structName: string) {
    return `struct ${structName}`;
  },
};
