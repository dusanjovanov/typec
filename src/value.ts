import { RValue } from "./rValue";
import type { CodeLike } from "./types";

/** A value container containing an `rvalue` expression with helpers for generating other expression that include it. */
export class Value extends RValue {
  constructor(valueExp: CodeLike) {
    super(valueExp);
  }
  kind = "value" as const;

  static new(valueExp: CodeLike) {
    return new Value(valueExp);
  }
}
