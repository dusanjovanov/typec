import { Operator } from "./operators";
import type { Pointer } from "./pointer";
import { Simple } from "./simple";
import type { CodeLike } from "./types";
import { Value } from "./value";

export class BaseValue<T extends Simple | Pointer | Value = any> {
  constructor(type: T) {
    this.type = type;
  }
  type;

  /** Returns the `+` binary expression between this value and a number value expression. */
  plus(value: CodeLike) {
    return Value.new(this.type, Operator.plus(this, value));
  }

  /** Returns a bool value for the `>` expression between this variable's name and a value expression of the same type.  */
  greaterThan(value: CodeLike) {
    return Value.bool(Operator.greaterThan(this, value));
  }

  /** Returns a bool value for the `<` expression between this variable's name and a value expression of the same type.  */
  lessThan(value: CodeLike) {
    return Value.bool(Operator.lessThan(this, value));
  }

  /** Returns the `-` binary expression between this value and an integer value expression. */
  minus(value: CodeLike) {
    return Value.new(this.type, Operator.minus(this, value));
  }

  equal(value: CodeLike) {
    return Value.bool(Operator.equal(this, value));
  }

  notEqual(value: CodeLike) {
    return Value.bool(Operator.notEqual(this, value));
  }
}
