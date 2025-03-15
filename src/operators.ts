import type { AutoSimpleSpecifier, PassingValue } from "./types";

const preUn = (op: string) => (exp: PassingValue) => `${op}${exp}`;
const postUn = (op: string) => (exp: PassingValue) => `${exp}${op}`;

const binOp = (op: string) => (left: string, right: PassingValue) => {
  return `${left}${op}${right}`;
};

export class Operator {
  // Unary operators

  /** Prefix increment */
  static preInc = preUn("++");
  /** Postfix increment */
  static postInc = postUn("++");
  /** Prefix decrement */
  static preDec = preUn("--");
  /** Postfix decrement */
  static postDec = postUn("--");
  /** Unary not ( ! ) */
  static not = preUn("!");

  static bitNot = preUn("~");

  static sizeOf(exp: string) {
    return `sizeof(${exp})`;
  }
  static alignOf(exp: string) {
    return `alignof(${exp})`;
  }

  /** Dereference operator `*`. */
  static valueOf(pointerName: string) {
    return `*${pointerName}`;
  }

  /** Reference operator `&`. */
  static addressOf = preUn("&");

  // Binary operators
  static modulo = binOp("%");
  static plus = binOp("+");
  static minus = binOp("-");
  /** Division */
  static div = binOp("/");
  static mult = binOp("*");
  static eq = binOp("==");
  static neq = binOp("!=");
  static gt = binOp(">");
  static lt = binOp("<");
  static gte = binOp(">=");
  static lte = binOp("<=");
  static and = binOp("&&");
  static or = binOp("||");
  static bitAnd = binOp("&");
  static bitOr = binOp("|");
  static bitXor = binOp("^");
  /** Shift left */
  static bitLeft = binOp("<<");
  /** Shift right */
  static bitRight = binOp(">>");

  // Assignment operators
  static assign = binOp("=");
  static plusAssign = binOp("+=");
  static minusAssign = binOp("-=");
  static multAssign = binOp("*=");
  static divAssign = binOp("/=");
  static moduloAssign = binOp("%=");
  static bitAndAssign = binOp("&=");
  static bitOrAssign = binOp("|=");
  static bitXorAssign = binOp("^=");
  static bitLeftAssign = binOp("<<=");
  static bitRightAssign = binOp(">>=");

  /**
   * Returns a type cast expression.
   */
  static cast(type: AutoSimpleSpecifier, exp: string) {
    return `(${type})(${exp})`;
  }

  /**
   * Accesses a struct member by value (e.g., structName.member).
   */
  static byValue(structName: string, member: string) {
    return `${structName}.${member}`;
  }

  /**
   * Accesses a struct member by pointer (e.g., structName->member).
   */
  static byAddress(structName: string, member: string) {
    return `${structName}->${member}`;
  }

  /**
   * Creates a ternary expression (e.g., condition ? exp1 : exp2).
   */
  static ternary(condition: string, exp1: PassingValue, exp2: PassingValue) {
    return `${condition}?${exp1}:${exp2}`;
  }
}
