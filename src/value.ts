import type { AutoSimpleSpecifier, StringLike } from "./types";

/** A value container containing an rvalue expression which resolves to a data type value. */
export class Value<T extends AutoSimpleSpecifier> {
  constructor(type: T, value: StringLike) {
    this.type = type;
    this.value = value;
  }
  kind = "value" as const;
  type;
  value;

  toString() {
    return String(this.value);
  }

  static int(value: StringLike) {
    return Value.new("int", value);
  }

  static unsignedInt(value: StringLike) {
    return Value.new("unsigned int", value);
  }

  static short(value: StringLike) {
    return Value.new("short", value);
  }

  static char(value: string) {
    return Value.new("char", value);
  }

  static wchar(value: string) {
    return Value.new("wchar_t", value);
  }

  static bool(value: string) {
    return Value.new("bool", value);
  }

  static new<T extends AutoSimpleSpecifier>(type: T, value: StringLike) {
    return new Value(type, value);
  }
}
