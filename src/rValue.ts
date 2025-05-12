import { Chunk } from "./chunk";
import { Condition } from "./condition";
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

  /** Returns a Value for the `*` binary expression between this and another expression. */
  mul(value: CodeLike) {
    return Operator.mul(this, value);
  }

  /** Returns a Value for the `/` binary expression between this and another expression. */
  div(value: CodeLike) {
    return Operator.div(this, value);
  }

  /** Returns a Value for the `%` binary expression between this and another expression. */
  modulo(value: CodeLike) {
    return Operator.modulo(this, value);
  }

  /** Returns a Value for the `>` expression between this and another expression.  */
  gt(value: CodeLike) {
    return Operator.gt(this, value);
  }

  /** Returns a Value for the `<` expression between this and another expression.  */
  lt(value: CodeLike) {
    return Operator.lt(this, value);
  }

  /** Returns a Value for the `>=` expression between this and another expression.  */
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

  /** Returns a Value for the `!` unary expression.  */
  not() {
    return Operator.not(this);
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
   * The second argument - return value is optional
   * 
   * Useful for early checks and returns.
   * 
   * This code in Typescript:
   * ```ts
   * strPointer.equalReturn(NULL, NULL);
   * ```
   * Produces this C code:
   * ```c
   * if (str == NULL) {
       return NULL; 
     }
   * ```
   */
  equalReturn(valueToCompare: CodeLike, returnValue?: CodeLike) {
    return Condition.if(this.equal(valueToCompare), [
      Operator.return(returnValue),
    ]);
  }

  /**
   * Returns an if block with the value itself as the condition and returns the expression argument.
   */
  thenReturn(returnValue?: CodeLike) {
    return Condition.if(this, [Operator.return(returnValue)]);
  }

  /**
   * Returns an if block that checks if the value is falsy using the ! unary operator and returns the expression argument.
   */
  notReturn(returnValue?: CodeLike) {
    return Condition.if(this.not(), [Operator.return(returnValue)]);
  }

  /**
   * Returns an if block with the value itself as the condition and accepts an argument to be the if's body.
   */
  then(body: CodeLike[]) {
    return Condition.if(this, body);
  }

  /**
   * Returns an if block that checks if the value is falsy using the ! unary operator and accepts an argument to be the if's body.
   */
  notThen(body: CodeLike[]) {
    return Condition.if(this.not(), body);
  }

  /** Returns a Value for the `|` expression between this and another expression.  */
  bitOr(value: CodeLike) {
    return Operator.bitOr(this, value);
  }

  /** Returns a Value for the `&` expression between this and another expression.  */
  bitAnd(value: CodeLike) {
    return Operator.bitAnd(this, value);
  }

  /** Returns a Value for the sizeof expression.  */
  sizeOf() {
    return Operator.sizeOf(this);
  }

  /** Assign a value. */
  assign(value: CodeLike) {
    return Operator.assign(this, value);
  }

  /** Returns a Value with the `-` in front of this Value. */
  negative() {
    return Operator.negative(this);
  }

  /** Returns a Value for an index accessor `arr[3]`. */
  at(index: CodeLike) {
    return Operator.subscript(this, index);
  }

  /** Access a member of the struct directly. */
  dot(key: CodeLike) {
    return Operator.dot(this, key);
  }

  /** Access a member of the struct through a pointer. */
  arrow(key: CodeLike) {
    return Operator.arrow(this, key);
  }

  /** Returns the reference expression for this value. `&expression`. */
  ref() {
    return Operator.ref(this);
  }

  /** Returns assignments to multiple struct members by value ( dot ). */
  assignMultipleDot(values: Record<string, CodeLike>) {
    return Chunk.new(
      ...Object.entries(values).map(([key, value]) => {
        return this.dot(key).assign(value);
      })
    );
  }

  /** Returns assignments to multiple struct members by reference ( arrow ). */
  assignMultipleArrow(values: Record<string, CodeLike>) {
    return Chunk.new(
      ...Object.entries(values).map(([key, value]) => {
        return this.arrow(key).assign(value);
      })
    );
  }

  /** Returns a subscript assignment statement. e.g. `ptr[3] = '\0'` */
  subAssign(index: CodeLike, value: CodeLike) {
    return Operator.assign(Operator.subscript(this, index), value);
  }

  /** `+=` */
  plusAssign(value: CodeLike) {
    return Operator.plusAssign(this, value);
  }

  /** `-=` */
  minusAssign(value: CodeLike) {
    return Operator.minusAssign(this, value);
  }

  /** `*=` */
  mulAssign(value: CodeLike) {
    return Operator.mulAssign(this, value);
  }

  /** `/=` */
  divAssign(value: CodeLike) {
    return Operator.divAssign(this, value);
  }

  /** `%=` */
  moduloAssign(value: CodeLike) {
    return Operator.moduloAssign(this, value);
  }

  /** Wraps the expression in parenthesis. */
  parens() {
    return Operator.parens(this);
  }

  /** `a++` */
  postInc() {
    return Operator.postInc(this);
  }

  /** `a--` */
  postDec() {
    return Operator.postDec(this);
  }

  /** `++a` */
  preInc() {
    return Operator.preInc(this);
  }

  /** `--a` */
  preDec() {
    return Operator.preDec(this);
  }

  /** Returns a function call expression. */
  call(...args: CodeLike[]) {
    return Operator.call(this, args);
  }

  /** Returns the function return expression that returns this value. */
  return() {
    return Operator.return(this);
  }
}
