import type { AutoSimpleSpecifier, PassingValue } from "./types";

const preUn = (op: string) => (name: string) => `${op}${name}`;
const postUn = (op: string) => (name: string) => `${name}${op}`;

export const preInc = preUn("++");

export const postInc = postUn("++");

export const preDec = preUn("--");

export const postDec = postUn("--");

export const not = preUn("!");

export const bitNot = preUn("~");

export const sizeOf = (exp: string) => `sizeof(${exp})`;

export const alignOf = (exp: string) => `alignof(${exp})`;

export const valueOf = (pointerName: string) => `*${pointerName}`;

export const addressOf = preUn("&");

const binOp = (op: string) => (left: string, right: PassingValue) => {
  return `${left}${op}${right}`;
};

export const modulo = binOp("%");

export const plus = binOp("+");

export const minus = binOp("-");

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

export const bitLeft = binOp("<<");

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

export const cast = (type: AutoSimpleSpecifier, exp: string) => {
  return `(${type})(${exp})`;
};

export const byValue = (structName: string, member: string) => {
  return `${structName}.${member}`;
};

export const byAddress = (structName: string, member: string) => {
  return `${structName}->${member}`;
};

export const ternary = (
  condition: string,
  exp1: PassingValue,
  exp2: PassingValue
) => {
  return `${condition}?${exp1}:${exp2}`;
};
