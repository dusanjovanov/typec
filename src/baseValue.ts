import { Condition } from "./condition";
import { Func } from "./func";
import { Operator } from "./operators";
import type { CodeLike } from "./types";
import { Value } from "./value";

export class BaseValue {
  /** Returns the `+` binary expression between this value and a number value expression. */
  plus(value: CodeLike) {
    return Value.new(Operator.plus(this, value));
  }

  /** Returns a bool value for the `>` expression between this variable's name and a value expression of the same type.  */
  greaterThan(value: CodeLike) {
    return Value.new(Operator.greaterThan(this, value));
  }

  /** Returns a bool value for the `<` expression between this variable's name and a value expression of the same type.  */
  lessThan(value: CodeLike) {
    return Value.new(Operator.lessThan(this, value));
  }

  /** Returns the `-` binary expression between this value and an integer value expression. */
  minus(value: CodeLike) {
    return Value.new(Operator.minus(this, value));
  }

  equal(value: CodeLike) {
    return Value.new(Operator.equal(this, value));
  }

  notEqual(value: CodeLike) {
    return Value.new(Operator.notEqual(this, value));
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
