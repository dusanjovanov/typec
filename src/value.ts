import { BaseValue } from "./baseValue";
import { NULL, NULL_TERM } from "./constants";
import type { CodeLike } from "./types";

/** A value container containing an `rvalue` expression with helpers for generating other expression that include it. */
export class Value extends BaseValue {
  constructor(valueExp: CodeLike) {
    super(valueExp);
  }
  kind = "value" as const;

  /** Value for the `NULL` macro. */
  static null() {
    return Value.new(NULL);
  }

  /** Value for a null terminator char. */
  static nullTerm() {
    return Value.new(NULL_TERM);
  }

  static new(valueExp: CodeLike) {
    return new Value(valueExp);
  }
}
