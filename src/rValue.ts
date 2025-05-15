import { Chunk } from "./chunk";
import { Condition } from "./condition";
import { Lit } from "./literal";
import { Op } from "./operators";
import { Type } from "./type";
import type { CodeLike, Numberish, TypeArg } from "./types";
import { typeArgToType, Utils } from "./utils";

/**
 * A value container containing an `rvalue` expression with helpers for generating all C literal and initializer expressions
 * and other, more complex, expressions that include it by chaining.
 *
 * This is also the base class from which `Var` ( `Par` ) inherits from.
 */
export class Val<S extends string> {
  constructor(type: TypeArg<S>, valueExp: CodeLike) {
    this.type = typeArgToType(type);
    this.value = String(valueExp);
  }
  type;
  value;

  toString() {
    return String(this.value);
  }

  /** Returns a Value for the `+` binary expression between this and another expression. */
  plus(value: CodeLike) {
    return Op.plus(Type.any(), this, value);
  }

  /** Returns a Value for the `-` binary expression between this and another expression. */
  minus(value: CodeLike) {
    return Op.minus(Type.any(), this, value);
  }

  /** Returns a Value for the `*` binary expression between this and another expression. */
  mul(value: CodeLike) {
    return Op.mul(Type.any(), this, value);
  }

  /** Returns a Value for the `/` binary expression between this and another expression. */
  div(value: CodeLike) {
    return Op.div(Type.any(), this, value);
  }

  /** Returns a Value for the `%` binary expression between this and another expression. */
  modulo(value: CodeLike) {
    return Op.modulo(Type.any(), this, value);
  }

  /** Returns a Value for the `>` expression between this and another expression.  */
  gt(value: CodeLike) {
    return Op.gt(this, value);
  }

  /** Returns a Value for the `<` expression between this and another expression.  */
  lt(value: CodeLike) {
    return Op.lt(this, value);
  }

  /** Returns a Value for the `>=` expression between this and another expression.  */
  gte(value: CodeLike) {
    return Op.gte(this, value);
  }

  /** Returns a Value for the `<=` expression between this and another expression.  */
  lte(value: CodeLike) {
    return Op.lte(this, value);
  }

  /** Returns a Value for the `==` expression between this and another expression.  */
  equal(value: CodeLike) {
    return Op.equal(this, value);
  }

  /** Returns a Value for the `!` unary expression.  */
  not() {
    return Op.not(this);
  }

  /** Returns a Value for the `!=` expression between this and another expression.  */
  notEqual(value: CodeLike) {
    return Op.notEqual(this, value);
  }

  /** Returns a Value for the `||` expression between this and another expression.  */
  or(value: CodeLike) {
    return Op.or(this, value);
  }

  /** Returns a Value for the cast `(type)exp` expression of this expression to the passed Type.  */
  cast(type: Type<any>) {
    return Op.cast(type, this);
  }

  /** Returns a Value for the ternary `cond?exp1:exp2` expression where the condition is this expression.  */
  ternary(exp1: CodeLike, exp2: CodeLike) {
    return Op.ternary(this, exp1, exp2);
  }

  /**
   * Returns the smaller value expression using relational logical operators between this variable's name and another expression of the same type.
   */
  min(value: CodeLike) {
    return Utils.min(this, value);
  }

  /** Returns an assignment expression with a clamped value between min and max. */
  clamp(min: CodeLike, max: CodeLike) {
    // TODO: first type ?
    return Op.assign(Type.any(), this, Utils.clamp(this, min, max));
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
    return Condition.if(this.equal(valueToCompare), [Op.return(returnValue)]);
  }

  /**
   * Returns an if block with the value itself as the condition and returns the expression argument.
   */
  thenReturn(returnValue?: CodeLike) {
    return Condition.if(this, [Op.return(returnValue)]);
  }

  /**
   * Returns an if block that checks if the value is falsy using the ! unary operator and returns the expression argument.
   */
  notReturn(returnValue?: CodeLike) {
    return Condition.if(this.not(), [Op.return(returnValue)]);
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
    return Op.bitOr(this, value);
  }

  /** Returns a Value for the `&` expression between this and another expression.  */
  bitAnd(value: CodeLike) {
    return Op.bitAnd(this, value);
  }

  /** Returns a Value for the sizeof expression.  */
  sizeOf() {
    return Op.sizeOf(this);
  }

  /** Assign a value. */
  assign(value: CodeLike) {
    // TODO: value type ?
    return Op.assign(Type.any(), this, value);
  }

  /** Returns a Value with the `-` in front of this Value. */
  negative() {
    return Op.negative(this);
  }

  /** Returns a Value for a subscript ( index ) accessor `arr[3]`. */
  at(index: CodeLike) {
    return Op.subscript(this, index);
  }

  /** Access a member of the struct directly. */
  dot(key: CodeLike) {
    return Op.dot(this, key);
  }

  /** Access a member of the struct through a pointer. */
  arrow(key: CodeLike) {
    return Op.arrow(this, key);
  }

  /** Returns the reference expression for this value. `&expression`. */
  ref() {
    return Op.ref(this.type.ptr(), this);
  }

  /** Returns the dereference expression for this value. `*expression`. */
  deRef() {
    return Op.deRef(this.type, this);
  }

  /** Returns assignments to multiple struct members by value ( dot ). */
  assignDotMulti(values: Record<string, CodeLike>) {
    return Chunk.new(
      ...Object.entries(values).map(([key, value]) => {
        return this.dot(key).assign(value);
      })
    );
  }

  /** Returns assignments to multiple struct members by reference ( arrow ). */
  assignArrowMulti(values: Record<string, CodeLike>) {
    return Chunk.new(
      ...Object.entries(values).map(([key, value]) => {
        return this.arrow(key).assign(value);
      })
    );
  }

  /** Returns a subscript assignment statement. e.g. `ptr[3] = '\0'` */
  subAssign(index: CodeLike, value: CodeLike) {
    // TODO: Element type of array otherwise any
    return Op.assign(Type.any(), Op.subscript(this, index), value);
  }

  /**
   * Returns a Chunk of subscript assignment statements
   * for each of the values passed starting from index 0 in increments of 1.
   */
  subAssignMulti(...values: CodeLike[]) {
    return Chunk.new(...values.map((v, i) => this.subAssign(i, v)));
  }

  /** `+=` */
  plusAssign(value: CodeLike) {
    return Op.plusAssign(this.type, this, value);
  }

  /** `-=` */
  minusAssign(value: CodeLike) {
    return Op.minusAssign(this.type, this, value);
  }

  /** `*=` */
  mulAssign(value: CodeLike) {
    return Op.mulAssign(this.type, this, value);
  }

  /** `/=` */
  divAssign(value: CodeLike) {
    return Op.divAssign(this.type, this, value);
  }

  /** `%=` */
  moduloAssign(value: CodeLike) {
    return Op.moduloAssign(this.type, this, value);
  }

  /** Wraps the expression in parenthesis. */
  parens() {
    return Op.parens(this.type, this);
  }

  /** `a++` */
  postInc() {
    return Op.postInc(this.type, this);
  }

  /** `a--` */
  postDec() {
    return Op.postDec(this.type, this);
  }

  /** `++a` */
  preInc() {
    return Op.preInc(this.type, this);
  }

  /** `--a` */
  preDec() {
    return Op.preDec(this.type, this);
  }

  /** Returns a function call expression. */
  call(...args: CodeLike[]) {
    return Op.call(this, args);
  }

  /** Returns the function return expression that returns this value. */
  return() {
    return Op.return(this);
  }

  /** Accepts an array of member names and returns an array of Values with an arrow access operator expression for each member. */
  arrowMulti<const Names extends string[]>(...memberNames: Names) {
    return memberNames.map((m) => Val.new(Type.any(), this.arrow(m))) as {
      [index in keyof Names]: Val<"any">;
    };
  }

  /**
   * Returns a Val for a string literal.
   *
   * `"abc"`
   */
  static str(s: string) {
    return Val.new(Type.string(), Lit.str(s));
  }

  /**
   * Returns a Val for a multiline string literal.
   *
   * Same as `string`, but for multiple strings each on a new line.
   */
  static strMulti(...strings: string[]) {
    return Val.new(Type.string(), Lit.strMulti(...strings));
  }

  /**
   * Returns a Val for a char literal.
   *
   * `'a'`
   */
  static char(c: string) {
    return Val.new(Type.char(), Lit.char(c));
  }

  /**
   * Returns a Val for an int literal.
   */
  static int(n: Numberish) {
    return Val.new(Type.int(), n);
  }

  /**
   * Returns a Val for an unsigned integer literal.
   *
   * `23U`
   */
  static unsigned(n: Numberish) {
    return Val.new(Type.simple("unsigned int"), Lit.unsigned(n));
  }

  /**
   * Returns a Val for a long literal.
   *
   * `23L`
   */
  static longInt(n: Numberish) {
    return Val.new(Type.simple("long"), n);
  }

  /**
   * Returns a Val for an unsigned long literal.
   *
   * `23UL`
   */
  static unsignedLongInt(n: Numberish) {
    return Val.new(Type.simple("unsigned long"), n);
  }

  /**
   * Returns a Val for a long long literal.
   *
   * `23LL`
   */
  static longLongInt(n: Numberish) {
    return Val.new(Type.simple("long long"), Lit.longLongInt(n));
  }

  /**
   * Returns a Val for an unsigned long long literal.
   *
   * `23ULL`
   */
  static unsignedLongLongInt(n: Numberish) {
    return Val.new(
      Type.simple("unsigned long long"),
      Lit.unsignedLongLongInt(n)
    );
  }

  /**
   * Returns a Val for a float literal.
   *
   * `23.45F`
   */
  static float(n: Numberish) {
    return Val.new(Type.float(), Lit.float(n));
  }

  /**
   * Returns a Val for a long double literal.
   *
   * `23.45L`
   */
  static longDouble(n: Numberish) {
    return Val.new(Type.simple("long double"), Lit.longDouble(n));
  }

  /**
   * Returns a Val for a wide char literal.
   *
   * `L'a'`
   */
  static wideChar(c: Numberish) {
    return Val.new(Type.simple("wchar_t"), Lit.wideChar(c));
  }

  /**
   * Returns a Val for a compound literal expression.
   *
   * `{ "abc", 123, &var }`
   */
  static compound(...values: CodeLike[]) {
    return Val.new(Type.any(), Lit.compound(...values));
  }

  /**
   * Returns a Val for a struct or union designated dot initializer expression.
   *
   * `{ .a = 3, .b = &var, .c = "def" }`
   */
  static designatedDot(values: Partial<Record<string, CodeLike>>) {
    return Val.new(Type.any(), Lit.designatedDot(values));
  }

  /**
   * Returns a Val for an array designated subscript initializer expression.
   *
   * `{ [1] = 2, [3] = 5 }`
   */
  static designatedSub(values: Partial<Record<number, CodeLike>>) {
    return Val.new(Type.any(), Lit.designatedSub(values));
  }

  /**
   * Returns a Val for a union single value initializer expression.
   *
   * `{23}`
   */
  static singleMemberInit(value: CodeLike) {
    return Val.new(Type.any(), value);
  }

  /** Used for defining an api for using macro values. */
  static macro<S extends string = "any">(name: CodeLike, type?: TypeArg<S>) {
    return Val.new<S>(type ?? (Type.any() as any), name);
  }

  static new<S extends string>(type: TypeArg<S>, valueExp: CodeLike) {
    return new Val(type, valueExp);
  }
}
