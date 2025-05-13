import { Lit } from "./literal";
import { Operator } from "./operators";
import { RValue } from "./rValue";
import type { CodeLike } from "./types";

/** A value container containing an `rvalue` expression with helpers for generating other expression that include it. */
export class Value extends RValue {
  constructor(valueExp: CodeLike) {
    super(valueExp);
  }
  kind = "value" as const;

  /** Numeric literal values. */
  static num(n: CodeLike) {
    return Value.new(n);
  }

  /**
   * string literal
   *
   * Returns the same string enclosed in double quotes with double quotes inside the string escaped.
   *
   * `"abc"`
   */
  static str(n: string) {
    return Value.new(Lit.str(n));
  }

  /**
   * multiline string literal
   *
   * Same as `string`, but for multiple strings each on a new line.
   */
  static strMulti(...strings: string[]) {
    return Value.new(Lit.strMulti(...strings));
  }

  /**
   * Returns a compound literal expression.
   *
   * `{ "abc", 123, &var }`
   */
  static compound(...values: CodeLike[]) {
    return Value.new(Lit.compound(...values));
  }

  /**
   * Returns the `sizeof` operator expression. `sizeof(exp)`
   */
  static sizeOf(exp: CodeLike) {
    return Operator.sizeOf(exp);
  }

  /** Used for defining an api for using macro values. */
  static macro(name: CodeLike) {
    return Value.new(name);
  }

  static new(valueExp: CodeLike) {
    return new Value(valueExp);
  }
}
