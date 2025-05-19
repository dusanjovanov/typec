import { BRANDING_MAP, isTcObject } from "./branding";
import { Cond } from "./condition";
import type { Func } from "./func";
import { Lit } from "./literal";
import { Stat } from "./statement";
import { Type } from "./type";
import type { GenericApi, Numberish, StatArg, TypeArg, ValArg } from "./types";
import { emptyFalsy, joinArgs, Utils } from "./utils";

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

  get type() {
    return this.exp.type;
  }

  toString() {
    switch (this.exp.kind) {
      case "literal": {
        return String(this.exp.value);
      }
      case "name": {
        return this.exp.name;
      }
      case "binary": {
        return `${this.exp.left}${this.exp.op}${this.exp.right}`;
      }
      case "preUnary": {
        return `${this.exp.op}${this.exp.value}`;
      }
      case "postUnary": {
        return `${this.exp.value}${this.exp.op}`;
      }
      case "member": {
        if (this.exp.op === "[]") return `${this.exp.left}[${this.exp.right}]`;
        return `${this.exp.left}${this.exp.op}${this.exp.right}`;
      }
      case "call": {
        return `${this.exp.funcName}(${emptyFalsy(this.exp.args, joinArgs)})`;
      }
      case "cast": {
        return `(${this.exp.type})${this.exp.value}`;
      }
      case "memory": {
        return `${this.exp.op}(${this.exp.value})`;
      }
      case "ternary": {
        return `${this.exp.cond}?${this.exp.exp1}:${this.exp.exp2}`;
      }
      case "type": {
        return `${this.exp.type}`;
      }
    }
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
  modulo(value: ValArg) {
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
      type: this.type,
      left: this,
      right: Val.valArgToVal(value),
      op,
    });
  }

  /** Assign a value. */
  assign(value: ValArg) {
    return this.assignBinary(value, "=");
  }

  /** `+=` */
  plusAssign(value: ValArg) {
    return this.assignBinary(value, "+=");
  }

  /** `-=` */
  minusAssign(value: ValArg) {
    return this.assignBinary(value, "-=");
  }

  /** `*=` */
  mulAssign(value: ValArg) {
    return this.assignBinary(value, "*=");
  }

  /** `/=` */
  divAssign(value: ValArg) {
    return this.assignBinary(value, "/=");
  }

  /** `%=` */
  moduloAssign(value: ValArg) {
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
  cast<S extends string>(type: Type<S>): Val<S> {
    return new Val({
      kind: "cast",
      type,
      value: this,
    });
  }

  /** Returns a Val for the `sizeof` operator for this value.  */
  sizeOf() {
    return Val.sizeOf(this);
  }

  /** Returns a Val with the `-` in front of this Val. */
  negative() {
    return new Val({
      kind: "preUnary",
      type: this.type,
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
  dot(key: string) {
    return new Val({
      kind: "member",
      type: Type.any(),
      left: this,
      right: new Val({ kind: "name", name: key, type: Type.any() }),
      op: ".",
    });
  }

  /** Access a member of the struct through a pointer. */
  arrow(key: string): Val {
    return new Val({
      kind: "member",
      type: Type.any(),
      left: this,
      right: new Val({ kind: "name", name: key, type: Type.any() }),
      op: "->",
    });
  }

  /** Returns the reference expression for this value. `&expression`. */
  ref(): Val<`${S}*`> {
    return new Val({
      kind: "preUnary",
      type: this.type.pointer(),
      value: this,
      op: "&",
    });
  }

  /** Returns the dereference expression for this value. `*expression`. */
  deRef() {
    return new Val({
      kind: "preUnary",
      // TODO: Extract type from pointer
      type: this.type,
      value: this,
      op: "*",
    });
  }

  /** `a++` */
  postInc() {
    return new Val({
      kind: "postUnary",
      type: this.type,
      value: this,
      op: "++",
    });
  }

  /** `a--` */
  postDec() {
    return new Val({
      kind: "postUnary",
      type: this.type,
      value: this,
      op: "--",
    });
  }

  /** `++a` */
  preInc() {
    return new Val({
      kind: "preUnary",
      type: this.type,
      value: this,
      op: "++",
    });
  }

  /** `--a` */
  preDec() {
    return new Val({
      kind: "preUnary",
      type: this.type,
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
  assignDotMulti(values: Record<string, ValArg>) {
    return Object.entries(values).map(([key, value]) => {
      return this.dot(key).assign(value);
    });
  }

  /** Returns assignments to multiple struct members by reference ( arrow ). */
  assignArrowMulti(values: Record<string, ValArg>) {
    return Object.entries(values).map(([key, value]) => {
      return this.arrow(key).assign(value);
    });
  }

  /** Returns a subscript assignment statement. e.g. `ptr[3] = '\0'` */
  subAssign(index: ValArg, value: ValArg) {
    return this.at(index).assign(value);
  }

  /**
   * Returns a Chunk of subscript assignment statements
   * for each of the values passed starting from index 0 in increments of 1.
   */
  subAssignMulti(...values: ValArg[]) {
    return values.map((v, i) => this.subAssign(i, v));
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

  api<Api extends GenericApi>(api: Api) {
    return new ValApi(this.exp, api);
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
   * Returns a Val for a float literal.
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
      value: Lit.compound(...values),
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

  /**
   * Returns a Val for a union single value initializer expression.
   *
   * `{23}`
   */
  static singleMemberInit(value: ValArg) {
    return new Val({
      kind: "literal",
      type: Type.any(),
      value: Lit.singleMemberInit(value),
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
  static call<S extends string>(func: Func<S, any>, ...args: ValArg[]) {
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
      type: value.type.pointer(),
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

  static valArgToVal(val: ValArg): Val {
    if (isTcObject("val", val)) {
      return val;
    }
    //
    else if (isTcObject("type", val)) {
      return new Val({ kind: "type", type: val });
    }
    //
    else if (isTcObject("struct", val)) {
      return new Val({ kind: "type", type: val.type() });
    }
    //
    else if (isTcObject("func", val)) {
      return new Val({ kind: "name", type: val.type, name: val.name });
    }
    //
    else if (typeof val === "number") {
      return Val.int(val);
    }
    //
    else {
      return new Val({ kind: "literal", type: Type.any(), value: val });
    }
  }
}

type ValueExp<S extends string> =
  | LiteralExp<S>
  | NameExp<S>
  | BinaryExp<S>
  | PreUnaryExp<S>
  | PostUnaryExp<S>
  | MemberExp<S>
  | TernaryExp<S>
  | FuncCallExp<S>
  | CastExp<S>
  | MemoryExp<S>
  | TypeExp<S>;

type BaseExp<S extends string> = {
  type: Type<S>;
};

type LiteralExp<S extends string> = BaseExp<S> & {
  kind: "literal";
  value: string | number | boolean | Type;
};

type NameExp<S extends string> = BaseExp<S> & {
  kind: "name";
  name: string;
};

type BinaryExp<S extends string> = BaseExp<S> & {
  kind: "binary";
  left: Val;
  right: Val;
  op:
    | "="
    | "+="
    | "-="
    | "*="
    | "/="
    | "%="
    | "&="
    | "|="
    | "^="
    | "<<="
    | ">>="
    | "+"
    | "-"
    | "*"
    | "/"
    | "%"
    | "&"
    | "|"
    | "^"
    | "<<"
    | ">>"
    | "&&"
    | "||"
    | "=="
    | "!="
    | "<"
    | ">"
    | "<="
    | ">=";
};

type PreUnaryExp<S extends string> = BaseExp<S> & {
  kind: "preUnary";
  value: Val;
  op: "++" | "--" | "*" | "&" | "!" | "+" | "-" | "~";
};

type PostUnaryExp<S extends string> = BaseExp<S> & {
  kind: "postUnary";
  value: Val;
  op: "++" | "--";
};

type MemberExp<S extends string> = BaseExp<S> & {
  kind: "member";
  left: Val;
  right: Val;
  op: "->" | "." | "[]";
};

type TernaryExp<S extends string> = BaseExp<S> & {
  kind: "ternary";
  cond: Val;
  exp1: Val;
  exp2: Val;
};

type FuncCallExp<S extends string> = BaseExp<S> & {
  kind: "call";
  funcName: string;
  args: Val[];
};

type CastExp<S extends string> = BaseExp<S> & {
  kind: "cast";
  value: Val;
};

type MemoryExp<S extends string> = BaseExp<S> & {
  kind: "memory";
  value: Val;
  op: "sizeof" | "alignof";
};

type TypeExp<S extends string> = BaseExp<S> & {
  kind: "type";
};

/**
 * tc equivalent of a class based api for a Val.
 */
export class ValApi<S extends string, Api extends GenericApi> extends Val<S> {
  constructor(exp: ValueExp<S>, funcs: Api) {
    super(exp);
    this.$ = Utils.bindFuncs(new Val(exp), funcs);
  }
  $;
}
