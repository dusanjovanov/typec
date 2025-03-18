import { BaseValue } from "./baseValue";
import { Operator } from "./operators";
import type { Type } from "./type";
import type { CodeLike } from "./types";

/** A value container containing an rvalue expression which resolves to a data type value. */
export class Value extends BaseValue {
  constructor(valueExp: CodeLike) {
    super();
    this.value = valueExp;
  }
  kind = "value" as const;
  value;

  toString() {
    return String(this.value);
  }

  cast(type: Type) {
    return Value.new(Operator.cast(type, this.value));
  }

  static new(valueExp: CodeLike) {
    return new Value(valueExp);
  }
}
