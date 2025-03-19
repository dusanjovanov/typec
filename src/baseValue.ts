import { Condition } from "./condition";
import { Func } from "./func";
import { Operator } from "./operators";
import type { Type } from "./type";
import type { CodeLike } from "./types";
import { Value } from "./value";

export class BaseValue {
  constructor(valueExp: CodeLike) {
    this.value = String(valueExp);
  }
  value;

  toString() {
    return String(this.value);
  }

  /** Returns a Value for the `+` binary expression between this and another expression. */
  plus(value: CodeLike) {
    return new Value(Operator.plus(this, value));
  }

  /** Returns a Value for the `-` binary expression between this and another expression. */
  minus(value: CodeLike) {
    return new Value(Operator.minus(this, value));
  }

  /** Returns a Value for the `>` expression between this and another expression.  */
  gt(value: CodeLike) {
    return new Value(Operator.gt(this, value));
  }

  /** Returns a Value for the `<` expression between this and another expression.  */
  lt(value: CodeLike) {
    return new Value(Operator.lt(this, value));
  }

  /** Returns a Value for the `<=` expression between this and another expression.  */
  gte(value: CodeLike) {
    return new Value(Operator.gte(this, value));
  }

  /** Returns a Value for the `<=` expression between this and another expression.  */
  lte(value: CodeLike) {
    return new Value(Operator.lte(this, value));
  }

  /** Returns a Value for the `==` expression between this and another expression.  */
  equal(value: CodeLike) {
    return new Value(Operator.equal(this, value));
  }

  /** Returns a Value for the `!=` expression between this and another expression.  */
  notEqual(value: CodeLike) {
    return new Value(Operator.notEqual(this, value));
  }

  /** Returns a Value for the `||` expression between this and another expression.  */
  or(value: CodeLike) {
    return Operator.or(this, value);
  }

  /** Returns a Value for the cast `(type)exp` expression of this expression to the passed Type.  */
  cast(type: Type) {
    return Value.new(Operator.cast(type, this));
  }

  /** Returns a Value for the ternary `cond?exp1:exp2` expression where the condition is this expression.  */
  ternary(exp1: CodeLike, exp2: CodeLike) {
    return Value.new(Operator.ternary(this, exp1, exp2));
  }

  /**
   * Returns an if block that checks if the value is equal to the first expression argument and returns the second expression argument.
   * 
   * The second argument is optional, and by default its value is the same as the first one.
   * 
   * Useful for early checks and returns.
   * 
   * This code in Typescript:
   * ```ts
   * strPointer.equalReturn(Value.null());
   * ```
   * Produces this C code:
   * ```c
   * if (str == NULL) {
       return NULL; 
     }
   * ```
   */
  equalReturn(
    valueToCompare: CodeLike,
    returnValue: CodeLike = valueToCompare
  ) {
    return Condition.if(this.equal(valueToCompare), [Func.return(returnValue)]);
  }
}
