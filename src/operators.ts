import type { TextLike } from "./types";

const preUn = (op: string) => (name: string) => `${op}${name}`;
const postUn = (op: string) => (name: string) => `${name}${op}`;

/** Prefix increment */
export const preInc = preUn("++");

/** Postfix increment */
export const postInc = postUn("++");

/** Prefix increment */
export const preDec = preUn("--");

/** Postfix increment */
export const postDec = postUn("--");

/** Unary operator ! */
export const not = preUn("!");

export const bitNot = preUn("~");

const binOp = (op: string) => (left: string, right: TextLike) =>
  `${left}${op}${right}`;

export const modulo = binOp("%");

export const plus = binOp("+");

export const minus = binOp("-");

/** Division */
export const div = binOp("/");

export const mult = binOp("*");

export const eq = binOp("==");

export const neq = binOp("!=");

export const gt = binOp(">");

export const lt = binOp("<");

export const gte = binOp(">=");

export const lte = binOp("<=");

export const and = binOp("&&");

export const or = binOp("||");

export const bitAnd = binOp("&");

export const bitOr = binOp("|");

export const bitXor = binOp("^");

/** Shift left */
export const bitLeft = binOp("<<");

/** Shift right */
export const bitRight = binOp(">>");

export const assign = binOp("=");

export const plusAssign = binOp("+=");

export const minusAssign = binOp("-=");

export const multAssign = binOp("*=");

export const divAssign = binOp("/=");

export const moduloAssign = binOp("%=");

export const bitAndAssign = binOp("&=");

export const bitOrAssign = binOp("|=");

export const bitXorAssign = binOp("^=");

export const bitLeftAssign = binOp("<<=");

export const bitRightAssign = binOp(">>=");

export const ternary = (condition: string, exp1: TextLike, exp2: TextLike) => {
  return `${condition}?${exp1}:${exp2}`;
};
