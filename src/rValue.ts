import { Condition } from "./condition";
import { Func } from "./func";
import { Operator } from "./operators";
import type { Type } from "./type";
import type { CodeLike } from "./types";
import { Utils } from "./utils";

/** Base class for `rvalue` expressions. */
export class RValue {
  constructor(valueExp: CodeLike) {
    this.value = String(valueExp);
  }
  value;

  toString() {
    return String(this.value);
  }

  /** Returns a Value for the `+` binary expression between this and another expression. */
  plus(value: CodeLike) {
    return Operator.plus(this, value);
  }

  /** Returns a Value for the `-` binary expression between this and another expression. */
  minus(value: CodeLike) {
    return Operator.minus(this, value);
  }

  /** Returns a Value for the `>` expression between this and another expression.  */
  gt(value: CodeLike) {
    return Operator.gt(this, value);
  }

  /** Returns a Value for the `<` expression between this and another expression.  */
  lt(value: CodeLike) {
    return Operator.lt(this, value);
  }

  /** Returns a Value for the `<=` expression between this and another expression.  */
  gte(value: CodeLike) {
    return Operator.gte(this, value);
  }

  /** Returns a Value for the `<=` expression between this and another expression.  */
  lte(value: CodeLike) {
    return Operator.lte(this, value);
  }

  /** Returns a Value for the `==` expression between this and another expression.  */
  equal(value: CodeLike) {
    return Operator.equal(this, value);
  }

  /** Returns a Value for the `!=` expression between this and another expression.  */
  notEqual(value: CodeLike) {
    return Operator.notEqual(this, value);
  }

  /** Returns a Value for the `||` expression between this and another expression.  */
  or(value: CodeLike) {
    return Operator.or(this, value);
  }

  /** Returns a Value for the cast `(type)exp` expression of this expression to the passed Type.  */
  cast(type: Type) {
    return Operator.cast(type, this);
  }

  /** Returns a Value for the ternary `cond?exp1:exp2` expression where the condition is this expression.  */
  ternary(exp1: CodeLike, exp2: CodeLike) {
    return Operator.ternary(this, exp1, exp2);
  }

  /**
   * Returns the smaller value expression using relational logical operators between this variable's name and another expression of the same type.
   */
  min(value: CodeLike) {
    return Utils.min(this, value);
  }

  /** Returns an assignment expression with a clamped value between min and max. */
  clamp(min: CodeLike, max: CodeLike) {
    return Operator.assign(this, Utils.clamp(this, min, max));
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
