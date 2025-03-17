import { Address } from "./address";
import { ArrayType } from "./array";
import { FuncType } from "./func";
import { Simple } from "./simple";
import type {
  AutoSimpleSpecifier,
  PointerQualifier,
  StringLike,
  TypeQualifier,
} from "./types";
import { emptyFalsy, join, stringSplice } from "./utils";
import { Value } from "./value";

/** A pointer type wrapping another type. */
export class Pointer<T extends Simple | ArrayType | FuncType | Pointer = any> {
  constructor(type: T, qualifiers: PointerQualifier[] = []) {
    this.type = type;
    this.qualifiers = qualifiers;

    if (this.type instanceof Simple) {
      this.specifier = `${this.type.full}*`;
    }
    //
    else if (this.type instanceof ArrayType) {
      this.specifier = stringSplice(
        this.type.specifier,
        this.type.specifier.indexOf("["),
        "(*)"
      );
    }
    //
    else if (this.type instanceof FuncType) {
      this.specifier = stringSplice(
        this.type.specifier,
        this.type.specifier.indexOf("("),
        "(*)"
      );
    }
    //
    else {
      this.specifier = stringSplice(
        this.type.specifier,
        this.type.specifier.indexOf("*"),
        "*"
      );
    }

    this.full = `${this.specifier}${emptyFalsy(
      qualifiers,
      (q) => ` ${join(q)}`
    )}`;
  }
  type: T;
  specifier;
  qualifiers;
  full;

  toAddress(value: string) {
    return new Address(this, value);
  }

  toValue(value: StringLike) {
    return new Value(this.type.specifier, value) as T extends Simple
      ? Value<T>
      : Value<never>;
  }

  static type<T extends Simple | ArrayType | FuncType | Pointer = any>(
    type: T,
    qualifiers?: PointerQualifier[]
  ) {
    return new Pointer(type, qualifiers);
  }

  /** Create a pointer type for a simple type. */
  static simple<T extends AutoSimpleSpecifier>(
    type: T,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Pointer.type(Simple.type(type, typeQualifiers), pointerQualifiers);
  }

  /** Pointer type for a char in a string. */
  static string(
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Pointer.simple("char", typeQualifiers, pointerQualifiers);
  }

  static void(
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Pointer.simple("void", typeQualifiers, pointerQualifiers);
  }

  static char(
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Pointer.simple("char", typeQualifiers, pointerQualifiers);
  }

  static int(
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Pointer.simple("int", typeQualifiers, pointerQualifiers);
  }

  static bool(
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Pointer.simple("bool", typeQualifiers, pointerQualifiers);
  }
}
