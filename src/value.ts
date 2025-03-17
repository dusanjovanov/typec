import { Simple } from "./simple";
import type { AutoSimpleSpecifier, StringLike } from "./types";

/** A value container containing an rvalue expression which resolves to a data type value. */
export class Value<T extends AutoSimpleSpecifier> {
  constructor(type: T, valueExp: StringLike) {
    this.type = Simple.type(type);
    this.value = valueExp;
  }
  kind = "value" as const;
  type;
  value;

  toString() {
    return String(this.value);
  }

  static int(intExp: StringLike) {
    return Value.new("int", intExp);
  }

  static unsignedInt(unsignedIntExp: StringLike) {
    return Value.new("unsigned int", unsignedIntExp);
  }

  static short(shortExp: StringLike) {
    return Value.new("short", shortExp);
  }

  static char(charExp: string) {
    return Value.new("char", charExp);
  }

  static wchar(wcharExp: string) {
    return Value.new("wchar_t", wcharExp);
  }

  static bool(boolExp: string) {
    return Value.new("bool", boolExp);
  }

  static size_t(sizetExp: string) {
    return Value.new("size_t", sizetExp);
  }

  static new<T extends AutoSimpleSpecifier>(type: T, valueExp: StringLike) {
    return new Value(type, valueExp);
  }
}
