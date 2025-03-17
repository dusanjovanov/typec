import { Simple } from "./simple";
import type { StringLike } from "./types";

/** A value container containing an rvalue expression which resolves to a data type value. */
export class Value<T extends Simple> {
  constructor(type: T, valueExp: StringLike) {
    this.type = type;
    this.value = valueExp;
  }
  kind = "value" as const;
  type;
  value;

  toString() {
    return String(this.value);
  }

  static int(intExp: StringLike) {
    return Value.new(Simple.int(), intExp);
  }

  static unsigned_int(unsignedIntExp: StringLike) {
    return Value.new(Simple.type("unsigned int"), unsignedIntExp);
  }

  static short(shortExp: StringLike) {
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

  static new<T extends Simple>(type: T, valueExp: StringLike) {
    return new Value(type, valueExp);
  }
}
