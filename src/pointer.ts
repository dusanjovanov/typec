import { Address } from "./address";
import { ArrayType } from "./array";
import { FuncType } from "./func";
import { Simple } from "./simple";
import type {
  AutoSimpleSpecifier,
  PointerTypeQualifier,
  TypeQualifier,
} from "./types";
import { stringSplice } from "./utils";
import { Value } from "./value";

/** A pointer type wrapping another type. */
export class Pointer<
  InnerType extends Simple | ArrayType | FuncType | Pointer = any
> {
  constructor(innerType: InnerType, qualifiers?: PointerTypeQualifier[]) {
    this.innerType = innerType;
    this.qualifiers = qualifiers;

    if (this.innerType instanceof Simple) {
      this.specifier = `${this.innerType.specifier}*`;
    }
    //
    else if (this.innerType instanceof ArrayType) {
      this.specifier = stringSplice(
        this.innerType.specifier,
        this.innerType.specifier.indexOf("["),
        "(*)"
      );
    }
    //
    else if (this.innerType instanceof FuncType) {
      this.specifier = stringSplice(
        this.innerType.specifier,
        this.innerType.specifier.indexOf("("),
        "(*)"
      );
    }
    //
    else {
      this.specifier = stringSplice(
        this.innerType.specifier,
        this.innerType.specifier.indexOf("*"),
        "*"
      );
    }
  }
  innerType: InnerType;
  specifier;
  qualifiers;

  toAddress(value: string) {
    return new Address(this, value);
  }

  toValue(value: string) {
    return new Value(this.innerType.specifier, value) as Value<
      InnerType["specifier"]
    >;
  }

  static new<T extends Simple | ArrayType | FuncType | Pointer = any>(
    type: T,
    qualifiers?: PointerTypeQualifier[]
  ) {
    return new Pointer(type, qualifiers);
  }

  /** Create a pointer type for a simple type. */
  static simple<T extends AutoSimpleSpecifier>(
    type: T,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerTypeQualifier[]
  ) {
    return Pointer.new(Simple.type(type, typeQualifiers), pointerQualifiers);
  }

  /** Pointer type for a char in a string. */
  static string(
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerTypeQualifier[]
  ) {
    return Pointer.simple("char", typeQualifiers, pointerQualifiers);
  }

  static void(
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerTypeQualifier[]
  ) {
    return Pointer.simple("void", typeQualifiers, pointerQualifiers);
  }

  static char(
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerTypeQualifier[]
  ) {
    return Pointer.simple("char", typeQualifiers, pointerQualifiers);
  }

  static int(
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerTypeQualifier[]
  ) {
    return Pointer.simple("int", typeQualifiers, pointerQualifiers);
  }

  static bool(
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerTypeQualifier[]
  ) {
    return Pointer.simple("bool", typeQualifiers, pointerQualifiers);
  }
}
