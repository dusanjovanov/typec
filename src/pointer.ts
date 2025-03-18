import { ArrayType } from "./array";
import { FuncType } from "./func";
import { Simple } from "./simple";
import type { AutoSimpleType, PointerQualifier, TypeQualifier } from "./types";
import { emptyFalsy, join, stringSplice } from "./utils";

/** A pointer type wrapping another type. */
export class Pointer<T extends Simple | ArrayType | FuncType | Pointer = any> {
  constructor(type: T, qualifiers: PointerQualifier[] = []) {
    this.type = type;
    this.qualifiers = qualifiers;

    switch (this.type.kind) {
      case "simple": {
        this.full = `${this.type.full}*${emptyFalsy(
          qualifiers,
          (q) => ` ${join(q)}`
        )}`;
        break;
      }
      case "array": {
        this.full = stringSplice(
          this.type.full,
          this.type.full.indexOf("["),
          `(*${emptyFalsy(qualifiers, (q) => `${join(q)}`)})`
        );
        break;
      }
      case "func": {
        this.full = stringSplice(
          this.type.full,
          this.type.full.indexOf("("),
          "(*)"
        );
        break;
      }
      case "pointer": {
        this.full = stringSplice(
          this.type.full,
          this.type.full.indexOf("*"),
          "*"
        );
        break;
      }
    }
  }
  kind = "pointer" as const;
  type: T;
  qualifiers;
  full;

  /** Get the pointer type to this pointer. */
  pointer(pointerQualifiers?: PointerQualifier[]) {
    return Pointer.type(this, pointerQualifiers);
  }

  /** Get the type this pointer points to. */
  inner() {
    return this.type;
  }

  static type<T extends Simple | ArrayType | FuncType | Pointer = any>(
    type: T,
    qualifiers?: PointerQualifier[]
  ) {
    return new Pointer(type, qualifiers);
  }

  /** Create a pointer type for a simple type. */
  static simple<T extends AutoSimpleType>(
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

  static size_t(
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Pointer.simple("size_t", typeQualifiers, pointerQualifiers);
  }
}
