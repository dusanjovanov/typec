import type { ArrayType } from "./array";
import type { FuncType } from "./func";
import { Literal } from "./literal";
import { Operator } from "./operators";
import type { Pointer } from "./pointer";
import { Simple } from "./simple";
import type { StructType } from "./struct";
import type { IntegerTypeSpecifier, TypeQualifier } from "./types";
import type { Value } from "./value";

/** A value container containing an rvalue expression which resolves to an address to a data type.  */
export class Address<
  T extends Simple | ArrayType | FuncType | Pointer | StructType
> {
  constructor(type: T, value: string) {
    this.type = type;
    this.value = value;
  }
  kind = "address" as const;
  type;
  value;

  toString() {
    return String(this.value);
  }

  /** Pointer arithmetic  */
  plus(value: Value<IntegerTypeSpecifier>) {
    return Address.new(this.type, Operator.plus(this.value, value));
  }

  /** Pointer arithmetic  */
  minus(value: Value<IntegerTypeSpecifier>) {
    return Address.new(this.type, Operator.minus(this.value, value));
  }

  /** Address to a char in the string. */
  static string(value: string, typeQualifiers?: TypeQualifier[]) {
    return Address.new(Simple.type("char", typeQualifiers), value);
  }

  /**
   * Address to a char in the string, but the value passed is treated as a string literal.
   *
   * Also adds `const` to the type ( C++ warns about this `-Wwrite-strings` )
   */
  static stringLiteral(value: string) {
    return Address.string(Literal.string(value), ["const"]);
  }

  /** NULL macro */
  static null() {
    return Address.new(Simple.void(), "0");
  }

  static new<T extends Simple | ArrayType | FuncType | Pointer | StructType>(
    type: T,
    value: string
  ) {
    return new Address(type, value);
  }
}
