import { BaseValue } from "./baseValue";
import type { CodeLike } from "./types";

/** A value container containing an rvalue expression which resolves to a data type value. */
export class Value extends BaseValue {
  constructor(valueExp: CodeLike) {
    super(valueExp);
    this.value = valueExp;
  }
  kind = "value" as const;
  value;

  static new(valueExp: CodeLike) {
    return new Value(valueExp);
  }
}
