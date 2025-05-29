import { BRANDING_MAP, isWhich } from "./brand";
import { Cond } from "./condition";
import type { Func } from "./func";
import { Lit } from "./literal";
import { Stat } from "./statement";
import type { Struct } from "./struct";
import { Type } from "./type";
import type {
  BinaryExp,
  GenericMembers,
  Numberish,
  StatArg,
  StringKeyOf,
  TypeArg,
  ValArg,
  ValueExp,
} from "./types";
import type { Union } from "./union";
import { emptyFalsy, joinArgs, memberTypeArgToType } from "./utils";

/**
 * A value container containing an `rvalue` expression with helpers for generating all C literal and initializer expressions
 * and other, more complex, expressions that include it by chaining.
 *
 * This is also the base class from which `Var` ( and `Param` ) inherits from.
 */
export class Val<S extends string = any> {
  constructor(exp: ValueExp<S>) {
    this.exp = exp;
  }
  kind = BRANDING_MAP.val;
  exp;

  get expType() {
    return this.exp.type;
  }

  get expKind() {
    return this.exp.kind;
  }

  private expToString(exp: ValueExp<any>): string {
    switch (exp.kind) {
      case "literal": {
        return String(exp.value);
      }
      case "name": {
        return exp.name;
      }
      case "binary": {
        return `${exp.left}${exp.op}${exp.right}`;
      }
      case "preUnary": {
        return `${exp.op}${exp.value}`;
      }
      case "postUnary": {
        return `${exp.value}${exp.op}`;
      }
      case "member": {
        if (exp.op === "[]") return `${exp.left}[${exp.right}]`;
        return `${exp.left}${exp.op}${exp.right}`;
      }
      case "call": {
        return `${exp.funcName}(${emptyFalsy(exp.args, joinArgs)})`;
      }
      case "cast": {
        const typePart = `(${exp.type})`;
        const expPart =
          exp.value.expKind === "binary" || exp.value.expKind === "ternary"
            ? `(${exp.value})`
            : exp.value;

        return typePart + expPart;
      }
      case "memory": {
        return `${exp.op}(${exp.value})`;
      }
      case "ternary": {
        return `${exp.cond}?${exp.exp1}:${exp.exp2}`;
      }
      case "type": {
        return `${exp.type}`;
      }
      case "parens": {
        return `(${this.expToString(exp.value.exp)})`;
      }
    }
  }

  toString() {
    return this.expToString(this.exp);
  }

  private binary(value: ValArg, op: BinaryExp<any>["op"]): Val {
    return new Val({
      kind: "binary",
      type: Type.any(),
      left: this,
      right: Val.valArgToVal(value),
      op,
    });
  }

  /** Returns a Val for the `+` binary expression between this and another expression. */
  plus(value: ValArg) {
    return this.binary(value, "+");
  }

  /** Returns a Val for the `-` binary expression between this and another expression. */
  minus(value: ValArg) {
    return this.binary(value, "-");
  }

  /** Returns a Val for the `*` binary expression between this and another expression. */
  mul(value: ValArg) {
    return this.binary(value, "*");
  }

  /** Returns a Val for the `/` binary expression between this and another expression. */
  div(value: ValArg) {
    return this.binary(value, "/");
  }

  /** Returns a Val for the `%` binary expression between this and another expression. */
  mod(value: ValArg) {
    return this.binary(value, "%");
  }

  private binaryLogical(
    value: ValArg,
    op: "==" | ">" | "<" | ">=" | "<=" | "!=" | "||" | "&&"
  ): Val<"bool"> {
    return new Val({
      kind: "binary",
      type: Type.bool(),
      left: this,
      right: Val.valArgToVal(value),
      op,
    });
  }

  /** Returns a Val for the `==` expression between this and another expression.  */
  equal(value: ValArg) {
    return this.binaryLogical(value, "==");
  }

  /** Returns a Val for the `>` expression between this and another expression.  */
  gt(value: ValArg) {
    return this.binaryLogical(value, ">");
  }

  /** Returns a Val for the `<` expression between this and another expression.  */
  lt(value: ValArg) {
    return this.binaryLogical(value, "<");
  }

  /** Returns a Val for the `>=` expression between this and another expression.  */
  gte(value: ValArg) {
    return this.binaryLogical(value, ">=");
  }

  /** Returns a Val for the `<=` expression between this and another expression.  */
  lte(value: ValArg) {
    return this.binaryLogical(value, "<=");
  }

  /** Returns a Val for the `!=` expression between this and another expression.  */
  notEqual(value: ValArg) {
    return this.binaryLogical(value, "!=");
  }

  /** Returns a Val for the `||` expression between this and another expression.  */
  and(value: ValArg) {
    return this.binaryLogical(value, "&&");
  }

  /** Returns a Val for the `||` expression between this and another expression.  */
  or(value: ValArg) {
    return this.binaryLogical(value, "||");
  }

  /** Returns a Val for the `|` expression between this and another expression.  */
  bitOr(value: ValArg) {
    return this.binary(value, "|");
  }

  /** Returns a Val for the `&` expression between this and another expression.  */
  bitAnd(value: ValArg) {
    return this.binary(value, "&");
  }

  private assignBinary(
    value: ValArg,
    op: "=" | "+=" | "-=" | "*=" | "/=" | "%="
  ): Val<S> {
    return new Val({
      kind: "binary",
      type: this.expType,
      left: this,
      right: Val.valArgToVal(value),
      op,
    });
  }

  /** Returns a Val for the assignment expression of the passed value to the current Val. */
  set(value: ValArg) {
    return this.assignBinary(value, "=");
  }

  /** `+=` */
  plusSet(value: ValArg) {
    return this.assignBinary(value, "+=");
  }

  /** `-=` */
  minusSet(value: ValArg) {
    return this.assignBinary(value, "-=");
  }

  /** `*=` */
  mulSet(value: ValArg) {
    return this.assignBinary(value, "*=");
  }

  /** `/=` */
  divSet(value: ValArg) {
    return this.assignBinary(value, "/=");
  }

  /** `%=` */
  modSet(value: ValArg) {
    return this.assignBinary(value, "%=");
  }

  /** Returns a Val for the `!` unary expression.  */
  not() {
    return new Val({
      kind: "preUnary",
      type: Type.bool(),
      op: "!",
      value: this,
    });
  }

  /** Returns a Val for the cast `(type)exp` expression of this expression to the passed Type.  */
  cast<S extends string>(type: TypeArg<S>): Val<S> {
    return new Val({
      kind: "cast",
      type: Type.typeArgToType(type),
      value: this,
    });
  }

  /** Returns a Val for the `sizeof` operator for this value.  */
  sizeOf() {
    return Val.sizeOf(this);
  }

  /** Returns a Val with the `-` in front of this Val. */
  negate() {
    return new Val({
      kind: "preUnary",
      type: this.expType,
      value: this,
      op: "-",
    });
  }

  /** Returns a Val for a subscript ( index ) accessor `arr[3]`. */
  at(index: ValArg) {
    return new Val({
      kind: "member",
      type: Type.any(),
      left: this,
      right: Val.valArgToVal(index),
      op: "[]",
    });
  }

  /** Access a member of the struct directly. */
  dot(key: string, type = Type.any()) {
    return new Val({
      kind: "member",
      type,
      left: this,
      right: new Val({ kind: "name", name: key, type }),
      op: ".",
    });
  }

  /** Access a member of the struct through a pointer. */
  arrow(key: string, type = Type.any()): Val {
    return new Val({
      kind: "member",
      type,
      left: this,
      right: new Val({ kind: "name", name: key, type }),
      op: "->",
    });
  }

  /** Returns the reference expression for this value. `&expression`. */
  ref(): Val<`${S}*`> {
    return new Val({
      kind: "preUnary",
      type: this.expType.pointer(),
      value: this,
      op: "&",
    });
  }

  /** Returns the dereference expression for this value. `*expression`. */
  deRef() {
    return new Val({
      kind: "preUnary",
      type:
        this.expType.desc.kind === "pointer"
          ? this.expType.desc.type
          : this.expType,
      value: this,
      op: "*",
    }) as Val<S extends `${infer T}*` ? T : S>;
  }

  /** `a++` */
  postInc() {
    return new Val({
      kind: "postUnary",
      type: this.expType,
      value: this,
      op: "++",
    });
  }

  /** `a--` */
  postDec() {
    return new Val({
      kind: "postUnary",
      type: this.expType,
      value: this,
      op: "--",
    });
  }

  /** `++a` */
  preInc() {
    return new Val({
      kind: "preUnary",
      type: this.expType,
      value: this,
      op: "++",
    });
  }

  /** `--a` */
  preDec() {
    return new Val({
      kind: "preUnary",
      type: this.expType,
      value: this,
      op: "--",
    });
  }

  /** Returns a function call expression. */
  call(...args: ValArg[]) {
    return new Val({
      kind: "call",
      type: Type.any(),
      funcName: this.toString(),
      args: args.map((arg) => Val.valArgToVal(arg)),
    });
  }

  /** Returns a Val for the ternary `cond?exp1:exp2` expression where the condition is the current value.  */
  ternary(exp1: ValArg, exp2: ValArg) {
    return Val.ternary(this, exp1, exp2);
  }

  /** Returns a Val for the function return statement that returns this value. */
  return() {
    return Stat.return(this);
  }

  /** Accepts an array of member names and returns an array of Values with an arrow access operator expression for each member. */
  arrowMulti<const Names extends readonly string[]>(...memberNames: Names) {
    return memberNames.map((m) => this.arrow(m)) as {
      [index in keyof Names]: Val<"any">;
    };
  }

  /** Returns assignments to multiple struct members by value ( dot ). */
  setDotMulti(values: Record<string, ValArg>) {
    return Object.entries(values).map(([key, value]) => {
      return this.dot(key).set(value);
    });
  }

  /** Returns assignments to multiple struct members by reference ( arrow ). */
  setArrowMulti(values: Record<string, ValArg>) {
    return Object.entries(values).map(([key, value]) => {
      return this.arrow(key).set(value);
    });
  }

  /** Returns a subscript assignment statement. e.g. `ptr[3] = '\0'` */
  setSub(index: ValArg, value: ValArg) {
    return this.at(index).set(value);
  }

  /**
   * Returns a Chunk of subscript assignment statements
   * for each of the values passed starting from index 0 in increments of 1.
   */
  setSubMulti(...values: ValArg[]) {
    return values.map((v, i) => this.setSub(i, v));
  }

  /**
   * A utility for returning the smaller value between the current and passed value using ternary and `<`.
   */
  min(value: ValArg) {
    return Val.ternary(this.lt(value), this, value);
  }

  /**
   * A utility for returning the greater value between the current and passed value using ternary and `>`.
   */
  max(value: ValArg) {
    return Val.ternary(this.gt(value), this, value);
  }

  /**
   * A utility for clamping the current value between min and max using ternary and `<` `>` operators.
   */
  clamp(minValue: ValArg, maxValue: ValArg) {
    return Val.ternary(
      this.lt(minValue),
      minValue,
      Val.ternary(this.gt(maxValue), maxValue, this)
    );
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
  equalReturn(valueToCompare: ValArg, returnValue?: ValArg) {
    return Cond.if(this.equal(valueToCompare), [Stat.return(returnValue)]);
  }

  /**
   * Returns an if block with the value itself as the condition and returns the expression argument.
   */
  thenReturn(returnValue?: ValArg) {
    return Cond.if(this, [Stat.return(returnValue)]);
  }

  /**
   * Returns an if block that checks if the value is falsy using the ! unary operator and returns the expression argument.
   */
  notReturn(returnValue?: ValArg) {
    return Cond.if(this.not(), [Stat.return(returnValue)]);
  }

  /**
   * Returns an if block with the value itself as the condition and accepts an argument to be the if's body.
   */
  then(statements: StatArg[]) {
    return Cond.if(this, statements);
  }

  /**
   * Returns an if block that checks if the value is falsy using the ! unary operator and accepts an argument to be the if's body.
   */
  notThen(statements: StatArg[]) {
    return Cond.if(this.not(), statements);
  }

  /** Returns a Val for the current expression wrapped in parenthesis. */
  parens() {
    return Val.parens(this);
  }

  static parens(value: ValArg) {
    const v = Val.valArgToVal(value);
    return new Val({ kind: "parens", value: v, type: v.expType });
  }

  /**
   * Returns a Val for a string literal.
   *
   * `"abc"`
   */
  static str(s: string) {
    return new Val({
      kind: "literal",
      type: Type.string(),
      value: Lit.str(s),
    });
  }

  /**
   * Returns a Val for a multiline string literal.
   *
   * Same as `string`, but for multiple strings each on a new line.
   */
  static strMulti(...strings: string[]) {
    return new Val({
      kind: "literal",
      type: Type.string(),
      value: Lit.strMulti(...strings),
    });
  }

  /**
   * Returns a Val for a char literal.
   *
   * `'a'`
   */
  static char(c: string) {
    return new Val({
      kind: "literal",
      type: Type.char(),
      value: Lit.char(c),
    });
  }

  /**
   * Returns a Val for a wide char literal.
   *
   * `L'a'`
   */
  static wideChar(c: Numberish) {
    return new Val({
      kind: "literal",
      type: Type.simple("wchar_t"),
      value: Lit.wideChar(c),
    });
  }

  /**
   * Returns a Val for an int literal.
   */
  static int(n: Numberish) {
    return new Val({
      kind: "literal",
      type: Type.int(),
      value: n,
    });
  }

  /**
   * Returns a Val for an unsigned integer literal.
   *
   * `23U`
   */
  static unsigned(n: Numberish) {
    return new Val({
      kind: "literal",
      type: Type.simple("unsigned int"),
      value: Lit.unsigned(n),
    });
  }

  /**
   * Returns a Val for a long literal.
   *
   * `23L`
   */
  static longInt(n: Numberish) {
    return new Val({
      kind: "literal",
      type: Type.simple("long"),
      value: Lit.longInt(n),
    });
  }

  /**
   * Returns a Val for an unsigned long literal.
   *
   * `23UL`
   */
  static unsignedLongInt(n: Numberish) {
    return new Val({
      kind: "literal",
      type: Type.simple("unsigned long"),
      value: Lit.unsignedLongInt(n),
    });
  }

  /**
   * Returns a Val for a long long literal.
   *
   * `23LL`
   */
  static longLongInt(n: Numberish) {
    return new Val({
      kind: "literal",
      type: Type.simple("long long"),
      value: Lit.longLongInt(n),
    });
  }

  /**
   * Returns a Val for an unsigned long long literal.
   *
   * `23ULL`
   */
  static unsignedLongLongInt(n: Numberish) {
    return new Val({
      kind: "literal",
      type: Type.simple("unsigned long long"),
      value: Lit.unsignedLongLongInt(n),
    });
  }

  /**
   * Returns a Val for a float literal with a float suffix.
   *
   * If an integer number is passed, it automatically adds a `.0F` at the end.
   *
   * `23.45F`
   */
  static float(n: Numberish) {
    return new Val({
      kind: "literal",
      type: Type.float(),
      value: Lit.float(n),
    });
  }

  /**
   * Returns a Val for a long double literal.
   *
   * `23.45L`
   */
  static longDouble(n: Numberish) {
    return new Val({
      kind: "literal",
      type: Type.simple("long double"),
      value: Lit.longDouble(n),
    });
  }

  /**
   * Returns a Val for a compound literal expression.
   *
   * `{ "abc", 123, &var }`
   */
  static compound(...values: ValArg[]) {
    return new Val({
      kind: "literal",
      type: Type.any(),
      value: Lit.compound(...values.map((v) => Val.valArgToVal(v))),
    });
  }

  /**
   * Returns a Val for a struct or union designated dot initializer expression.
   *
   * `{ .a = 3, .b = &var, .c = "def" }`
   */
  static designatedDot(values: Partial<Record<string, ValArg>>) {
    return new Val({
      kind: "literal",
      type: Type.any(),
      value: Lit.designatedDot(values),
    });
  }

  /**
   * Returns a Val for an array designated subscript initializer expression.
   *
   * `{ [1] = 2, [3] = 5 }`
   */
  static designatedSub(values: Partial<Record<number, ValArg>>) {
    return new Val({
      kind: "literal",
      type: Type.any(),
      value: Lit.designatedSub(values),
    });
  }

  /** Returns a Val for a macro value. */
  static macro<S extends string = "any">(name: string, type?: TypeArg<S>) {
    return new Val<S>({
      kind: "name",
      type: type ?? (Type.any() as any),
      name: name.toString(),
    });
  }

  /** Takes in a Func and args and returns a call expression Val for it. */
  static call<S extends string>(func: Func<S, any, any>, ...args: ValArg[]) {
    return new Val({
      kind: "call",
      type: func.returnType,
      funcName: func.name,
      args: args.map((arg) => Val.valArgToVal(arg)),
    });
  }

  /** Returns a Val for the reference expression `&` for the passed Val. */
  static ref<S extends string>(value: Val<S>) {
    return new Val({
      kind: "preUnary",
      type: value.expType.pointer(),
      value,
      op: "&",
    });
  }

  /** Returns a Val for the `sizeof` expression. */
  static sizeOf(value: ValArg) {
    return new Val({
      kind: "memory",
      type: Type.size_t(),
      op: "sizeof",
      value: Val.valArgToVal(value),
    });
  }

  static alignOf(value: ValArg) {
    return new Val({
      kind: "memory",
      type: Type.int(),
      op: "alignof",
      value: Val.valArgToVal(value),
    });
  }

  /** Returns a Val for a ternary expression. */
  static ternary(cond: ValArg, exp1: ValArg, exp2: ValArg) {
    return new Val({
      kind: "ternary",
      type: Type.any(),
      cond: Val.valArgToVal(cond),
      exp1: Val.valArgToVal(exp1),
      exp2: Val.valArgToVal(exp2),
    });
  }

  static member<
    Members extends GenericMembers,
    Key extends StringKeyOf<Members>
  >(
    struct: Struct<any, Members> | Union<any, Members>,
    key: Key,
    left: ValArg,
    op: "->" | "."
  ) {
    return new Val({
      kind: "member",
      type: memberTypeArgToType(struct.members[key]),
      left: Val.valArgToVal(left),
      right: new Val({
        kind: "name",
        name: key,
        type: memberTypeArgToType(struct.members[key]),
      }),
      op,
    });
  }

  static valArgToVal(val: ValArg): Val {
    if (isWhich("val", val)) {
      return val;
    }
    //
    else if (isWhich("type", val)) {
      return new Val({ kind: "type", type: val });
    }
    //
    else if (isWhich("struct", val)) {
      return new Val({ kind: "type", type: val.type() });
    }
    //
    else if (isWhich("func", val) || isWhich("paramFunc", val)) {
      return new Val({ kind: "name", type: val.type, name: val.name });
    }
    //
    else if (typeof val === "number") {
      if (val % 1 !== 0) {
        return new Val({
          kind: "literal",
          type: Type.double(),
          value: val,
        });
      }
      return Val.int(val);
    }
    //
    else if (typeof val === "string") {
      const lastChar = val.at(-1)!;

      if (lastChar === "f" || lastChar === "F") {
        return Val.float(val);
      }
      //
      else if (lastChar === "l" || lastChar === "L") {
        return Val.longDouble(val);
      }
      //
      else {
        return Val.int(val);
      }
    }
    //
    else if (typeof val === "boolean") {
      return new Val({
        kind: "literal",
        type: Type.bool(),
        value: val,
      });
    }
    //
    else {
      return new Val({ kind: "literal", type: Type.any(), value: val as any });
    }
  }
}
