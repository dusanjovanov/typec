import type { Type } from "./type";
import type { CodeLike } from "./types";

const preUn = (op: string) => (exp: CodeLike) => `${op}${exp}`;
const postUn = (op: string) => (exp: CodeLike) => `${exp}${op}`;

const binOp = (op: string) => (left: CodeLike, right: CodeLike) => {
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

  // memory
  static sizeOf(exp: CodeLike) {
    return `sizeof(${exp})`;
  }
  static alignOf(exp: CodeLike) {
    return `alignof(${exp})`;
  }
  /** Dereference operator `*`. */
  static deRef(pointerName: CodeLike) {
    return `*${pointerName}`;
  }
  /** Reference operator `&`. */
  static ref = preUn("&");

  // Binary operators
  static modulo = binOp("%");
  static plus = binOp("+");
  static minus = binOp("-");
  /** Division */
  static div = binOp("/");
  static mult = binOp("*");

  // Logical

  // comparison
  static equal = binOp("==");
  static notEqual = binOp("!=");
  static gt = binOp(">");
  static lt = binOp("<");
  static gte = binOp(">=");
  static lte = binOp("<=");

  static and = binOp("&&");
  static or = binOp("||");

  // Bitwise
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
  static cast(type: Type, exp: CodeLike) {
    return `(${type})${exp}`;
  }

  /**
   * Accesses a struct member by value (e.g., `structVar.member`).
   */
  static dot(structExp: CodeLike, key: CodeLike) {
    return `${structExp}.${key}`;
  }

  /**
   * Accesses a struct member by pointer (e.g., `structVar->member`).
   */
  static arrow(structExp: CodeLike, key: CodeLike) {
    return `${structExp}->${key}`;
  }

  /** Access an array element by index. (e.g. `arr[2]`) */
  static subscript(arrExp: CodeLike, index: CodeLike) {
    return `${arrExp}[${index}]`;
  }

  /**
   * Creates a ternary expression (e.g., condition ? exp1 : exp2).
   */
  static ternary(condition: CodeLike, exp1: CodeLike, exp2: CodeLike) {
    return `${condition}?${exp1}:${exp2}`;
  }
}
