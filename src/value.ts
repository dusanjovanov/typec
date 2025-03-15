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
    return new Value("int", value);
  }

  static unsignedInt(value: StringLike) {
    return new Value("unsigned int", value);
  }

  static short(value: StringLike) {
    return new Value("short", value);
  }

  static char(value: string) {
    return new Value("char", value);
  }

  static wchar(value: string) {
    return new Value("wchar_t", value);
  }

  static new<T extends AutoSimpleSpecifier>(type: T, value: StringLike) {
    return new Value(type, value);
  }
}
