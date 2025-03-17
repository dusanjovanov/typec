import { Literal } from "./literal";
import { Pointer } from "./pointer";
import { Simple } from "./simple";
import type { StructType } from "./struct";
import type { InvalidValue, NullValue, TextLike, TypeQualifier } from "./types";

/** A value container containing an rvalue expression which resolves to a data type value. */
export class Value<T extends Simple | Pointer | StructType = any> {
  constructor(type: T, valueExp: TextLike) {
    this.type = type;
    this.value = valueExp;
  }
  kind = "value" as const;
  type;
  value;

  toString() {
    return String(this.value);
  }

  cast<T extends Simple | Pointer | StructType>(type: T) {
    return Value.new(type, this.value);
  }

  static int(intExp: TextLike) {
    return Value.new(Simple.int(), intExp);
  }

  static unsigned_int(unsignedIntExp: TextLike) {
    return Value.new(Simple.type("unsigned int"), unsignedIntExp);
  }

  static short(shortExp: TextLike) {
    return Value.new(Simple.type("short"), shortExp);
  }

  static char(charExp: string) {
    return Value.new(Simple.char(), charExp);
  }

  static wchar_t(wcharExp: string) {
    return Value.new(Simple.type("wchar_t"), wcharExp);
  }

  static bool(boolExp: string) {
    return Value.new(Simple.type("bool"), boolExp);
  }

  static size_t(sizetExp: string) {
    return Value.new(Simple.size_t(), sizetExp);
  }

  /** Returns a char* value. */
  static string(
    strExp: string,
    typeQualifiers?: TypeQualifier[],
    pointerTypeQualifiers?: TypeQualifier[]
  ) {
    return Value.new(
      Pointer.string(typeQualifiers, pointerTypeQualifiers),
      strExp
    );
  }

  /**
   * Returns a char* value, but the value passed is treated as a string literal ( wrapped in double quotes...etc ).
   */
  static stringLiteral(
    str: string,
    typeQualifiers?: TypeQualifier[],
    pointerTypeQualifiers?: TypeQualifier[]
  ) {
    return Value.new(
      Pointer.string(typeQualifiers, pointerTypeQualifiers),
      Literal.string(str)
    );
  }

  /** NULL pointer value - NULL typed as `void*` */
  static null(): NullValue {
    return Value.new(Pointer.void(), "NULL");
  }

  /** Invalid or impossible value typed as `Value<never>` */
  static invalid() {
    return Value.new(Simple.void(), "") as InvalidValue;
  }

  static new<T extends Simple | Pointer | StructType>(
    type: T,
    valueExp: TextLike
  ) {
    return new Value(type, valueExp);
  }
}
