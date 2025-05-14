import { Type } from "./type";
import type { CodeLike, TypeArg } from "./types";
import { emptyFalsy, emptyNotFalse, joinArgs, typeArgToType } from "./utils";
import { Val } from "./value";

const preUn = (op: string) => {
  return <S extends string>(type: TypeArg<S>, exp: CodeLike) => {
    return Val.new(type, `${op}${exp}`);
  };
};

const postUn = (op: string) => {
  return <S extends string>(type: TypeArg<S>, exp: CodeLike) => {
    return Val.new(type, `${exp}${op}`);
  };
};

const binOp = (op: string) => {
  return <S extends string>(
    type: TypeArg<S>,
    left: CodeLike,
    right: CodeLike
  ) => {
    return Val.new(type, `${left}${op}${right}`);
  };
};

const logicalBinOp = (op: string) => (left: CodeLike, right: CodeLike) => {
  return Val.new(Type.int(), `${left}${op}${right}`);
};

/** Operators */
export class Op {
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
  static not = (exp: CodeLike) => {
    return Val.new(Type.int(), `!${exp}`);
  };

  static bitNot = preUn("~");

  // memory
  static sizeOf(exp: CodeLike) {
    return Val.new(Type.size_t(), `sizeof(${exp})`);
  }
  static alignOf(exp: CodeLike) {
    return Val.new(Type.int(), `alignof(${exp})`);
  }
  /** Dereference operator `*`. */
  static deRef = preUn("*");
  /** Reference operator `&`. */
  static ref = preUn("&");

  // Binary operators
  static modulo = binOp("%");
  static plus = binOp("+");
  static minus = binOp("-");
  static div = binOp("/");
  static mul = binOp("*");

  // Assignment operators
  static assign = binOp("=");
  static plusAssign = binOp("+=");
  static minusAssign = binOp("-=");
  static mulAssign = binOp("*=");
  static divAssign = binOp("/=");
  static moduloAssign = binOp("%=");
  static bitAndAssign = binOp("&=");
  static bitOrAssign = binOp("|=");
  static bitXorAssign = binOp("^=");
  static bitLeftAssign = binOp("<<=");
  static bitRightAssign = binOp(">>=");

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
  static bitAnd = logicalBinOp("&");
  static bitOr = logicalBinOp("|");
  static bitXor = logicalBinOp("^");
  /** Shift left */
  static bitLeft = logicalBinOp("<<");
  /** Shift right */
  static bitRight = logicalBinOp(">>");

  /**
   * Returns a type cast expression.
   */
  static cast<S extends string>(type: TypeArg<S>, exp: CodeLike) {
    const t = typeArgToType(type);
    return Val.new(t, `(${t})${exp}`);
  }

  /**
   * Accesses a struct member by value (e.g., `structVar.member`).
   */
  static dot(structExp: CodeLike, key: CodeLike) {
    return Val.new(Type.any(), `${structExp}.${key}`);
  }

  /**
   * Accesses a struct member by pointer (e.g., `structVar->member`).
   */
  static arrow(structExp: CodeLike, key: CodeLike) {
    return Val.new(Type.any(), `${structExp}->${key}`);
  }

  /** Access an array element by index. (e.g. `arr[2]`) */
  static subscript(arrExp: CodeLike, index: CodeLike) {
    return Val.new(Type.any(), `${arrExp}[${index}]`);
  }

  /**
   * Creates a ternary expression (e.g., condition ? exp1 : exp2).
   */
  static ternary(condition: CodeLike, exp1: CodeLike, exp2: CodeLike) {
    return Val.new(Type.any(), `${condition}?${exp1}:${exp2}`);
  }

  static negative(exp: CodeLike) {
    return Val.new(Type.any(), `-(${exp})`);
  }

  /** Returns a return statement expression. */
  static return(value?: CodeLike) {
    return Val.new(Type.any(), `return${emptyNotFalse(value, (v) => ` ${v}`)}`);
  }

  /** Returns a function call expression. */
  static call(fnName: CodeLike, args: CodeLike[]) {
    return Val.new(Type.any(), `${fnName}(${emptyFalsy(args, joinArgs)})`);
  }

  /** Adds parenthesis around the expression. */
  static parens<S extends string>(type: TypeArg<S>, exp: CodeLike) {
    return Val.new(type, `(${exp})`);
  }
}
