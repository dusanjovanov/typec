import type { AutoSimpleSpecifier, PassingValue } from "./types";
import { Value } from "./value";

const preUn = (op: string) => (exp: PassingValue) => `${op}${exp}`;
const postUn = (op: string) => (exp: PassingValue) => `${exp}${op}`;

const binOp = (op: string) => (left: PassingValue, right: PassingValue) => {
  return `${left}${op}${right}`;
};

const logicalBinOp =
  (op: string) => (left: PassingValue, right: PassingValue) => {
    return Value.bool(binOp(op)(left, right));
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

  static sizeOf(exp: PassingValue) {
    return `sizeof(${exp})`;
  }
  static alignOf(exp: PassingValue) {
    return `alignof(${exp})`;
  }

  /** Dereference operator `*`. */
  static valueOf(pointerName: PassingValue) {
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

  // Logical
  static equal = logicalBinOp("==");
  static notEqual = logicalBinOp("!=");
  static gt = logicalBinOp(">");
  static lt = logicalBinOp("<");
  static gte = logicalBinOp(">=");
  static lte = logicalBinOp("<=");
  static and = logicalBinOp("&&");
  static or = logicalBinOp("||");

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
  static cast(type: AutoSimpleSpecifier, exp: PassingValue) {
    return `(${type})(${exp})`;
  }

  /**
   * Accesses a struct member by value (e.g., structName.member).
   */
  static byValue(structName: PassingValue, member: PassingValue) {
    return `${structName}.${member}`;
  }

  /**
   * Accesses a struct member by pointer (e.g., structName->member).
   */
  static byAddress(structName: PassingValue, member: PassingValue) {
    return `${structName}->${member}`;
  }

  /** Access an array element by index. (e.g. `arr[2]`) */
  static subscript(arrExp: PassingValue, index: PassingValue) {
    return `${arrExp}[${index}]`;
  }

  /**
   * Creates a ternary expression (e.g., condition ? exp1 : exp2).
   */
  static ternary(
    condition: PassingValue,
    exp1: PassingValue,
    exp2: PassingValue
  ) {
    return `${condition}?${exp1}:${exp2}`;
  }
}
