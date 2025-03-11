import type {
  AutoPointerQualifier,
  AutoQualifier,
  AutoSpecifier,
} from "./types";
import { emptyFalsy, join, pointerStars } from "./utils";

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
  /** Type of a pointer to a function */
  funcPointer(
    returnType: AutoSpecifier,
    paramTypes: AutoSpecifier[],
    level = 1
  ) {
    return `${returnType} (${pointerStars(level)})(${join(paramTypes, ",")})`;
  },
  /** Type of an entire array */
  arr(elementType: AutoSpecifier, len: number) {
    return `${elementType} [${len}]`;
  },
  /** Type of a pointer to an entire array */
  arrPointer(elementType: AutoSpecifier, len: number, level = 1) {
    return `${elementType} (${pointerStars(level)})[${len}]`;
  },
  /** Type of a struct instance */
  struct(structName: string) {
    return `struct ${structName}`;
  },
};
