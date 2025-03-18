import { BaseValue } from "./baseValue";
import { Literal } from "./literal";
import { Pointer } from "./pointer";
import { Simple } from "./simple";
import type { CodeLike, InvalidValue, NullValue, TypeQualifier } from "./types";

/** A value container containing an rvalue expression which resolves to a data type value. */
export class Value<
  T extends Simple | Pointer | Value = any
> extends BaseValue<T> {
  constructor(type: T, valueExp: CodeLike) {
    super(type);
    this.type = type;
    this.value = valueExp;
  }
  kind = "value" as const;
  type;
  value;

  toString() {
    return String(this.value);
  }

  cast<T extends Simple | Pointer>(type: T) {
    return Value.new(type, this.value);
  }

  static int(intExp: CodeLike) {
    return Value.new(Simple.int(), intExp);
  }

  static unsigned_int(unsignedIntExp: CodeLike) {
    return Value.new(Simple.type("unsigned int"), unsignedIntExp);
  }

  static short(shortExp: CodeLike) {
    return Value.new(Simple.short(), shortExp);
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
    strExp: CodeLike,
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

  /** Null terminator character. `'\0'` */
  static nullTerm() {
    return Value.char(Literal.char("\0"));
  }

  /** Invalid or impossible value typed as `Value<never>` */
  static invalid() {
    return Value.new(Simple.void(), "") as InvalidValue;
  }

  static new<T extends Simple | Pointer | Value>(type: T, valueExp: CodeLike) {
    return new Value(type, valueExp);
  }
}
