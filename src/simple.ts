import { Pointer } from "./pointer";
import {
  INTEGER_TYPES,
  NUMBER_TYPES,
  type AutoSimpleType,
  type IntegerType,
  type NumberType,
  type PointerQualifier,
  type TypecType,
  type TypeQualifier,
} from "./types";
import { emptyFalsy, join, Utils } from "./utils";

/** Simple type */
export class Simple<T extends AutoSimpleType = any> {
  constructor(specifier: T, qualifiers: TypeQualifier[] = []) {
    this.specifier = specifier;
    this.qualifiers = qualifiers;

    this.full = `${emptyFalsy(qualifiers, (q) => `${join(q)} `)}${
      this.specifier
    }`;
  }
  kind = "simple" as const;
  specifier;
  qualifiers;
  full;

  pointer(pointerQualifiers?: PointerQualifier[]) {
    return Pointer.type(this, pointerQualifiers);
  }

  /** Compare this type to any other type. */
  isEqual(type: TypecType) {
    return Utils.areTypesEqual(this, type);
  }

  /** Is this type any integer type ( int, char, long ...etc) */
  isInteger() {
    return INTEGER_TYPES.includes(this.specifier as IntegerType);
  }

  /** Is this type any number type ( int, double, float ...etc ) */
  isNumber() {
    return NUMBER_TYPES.includes(this.specifier as NumberType);
  }

  static type<T extends AutoSimpleType>(type: T, qualifiers?: TypeQualifier[]) {
    return new Simple(type, qualifiers);
  }

  static int(qualifiers?: TypeQualifier[]) {
    return Simple.type("int", qualifiers);
  }

  static size_t(qualifiers?: TypeQualifier[]) {
    return Simple.type("size_t", qualifiers);
  }

  static void(qualifiers?: TypeQualifier[]) {
    return Simple.type("void", qualifiers);
  }

  static char(qualifiers?: TypeQualifier[]) {
    return Simple.type("char", qualifiers);
  }

  static ptrDiff(qualifiers?: TypeQualifier[]) {
    return Simple.type("ptrdiff_t", qualifiers);
  }

  static short(qualifiers?: TypeQualifier[]) {
    return Simple.type("short", qualifiers);
  }
}
