import { Address } from "./address";
import { ArrayC, ArrayType } from "./array";
import { block, chunk, curly } from "./chunk";
import { _if, ifOnly } from "./conditional";
import { Func, FuncType, Param, VarArgsParam } from "./func";
import { gcc } from "./gcc";
import { includeRel, includeSys } from "./include";
import { whileLoop } from "./loops";
import {
  and,
  assign,
  bitAnd,
  bitAndAssign,
  bitLeft,
  bitLeftAssign,
  bitNot,
  bitOr,
  bitOrAssign,
  bitRight,
  bitRightAssign,
  bitXor,
  bitXorAssign,
  cast,
  div,
  divAssign,
  eq,
  gt,
  gte,
  lt,
  lte,
  minus,
  minusAssign,
  modulo,
  moduloAssign,
  mult,
  multAssign,
  neq,
  not,
  or,
  plus,
  plusAssign,
  postDec,
  postInc,
  preDec,
  preInc,
  ternary,
} from "./operators";
import { Pointer, PointerType } from "./pointer";
import { Simple } from "./simple";
import { std } from "./std";
import { Struct, StructType } from "./struct";
import { join, joinWithPrefix } from "./utils";
import { Variable } from "./variable";

export const tc = {
  /** Functions and helpers for standard C libraries */
  std,
  /** Takes in an array of statements as strings and adds semicolons and new lines appropriately. */
  chunk,
  /** Code between curly braces */
  curly,
  /** Chunk of code within curly braces. */
  block,
  /** #include "" */
  includeRel,
  /** #include <> */
  includeSys,
  /** Returns a variable declaration statement and optionally an assignment. */
  Variable,
  Simple,
  Pointer,
  PointerType,
  Address,
  /**
   * Returns an object which has the definition, prototype and a call helper for that function.
   */
  Func,
  FuncType,
  Param,
  VarArgsParam,
  /**
   * Returns an array variable declaration without initialization.
   */
  ArrayC,
  ArrayType,
  Struct,
  StructType,
  /**
   * Starts control block if statement that can be chained with else if and else.
   * Finally returns a string with `.toString()`.
   */
  if: _if,
  /**
   * Returns just the if block.
   */
  ifOnly,
  /**
   * Returns a while loop statement.
   */
  whileLoop,
  /**
   * Returns a type cast expression.
   */
  cast,
  join,
  joinWithPrefix,
  gcc,
  /** Unary operator ! */
  not,
  plus,
  minus,
  /** Division */
  div,
  mult,
  and,
  or,
  modulo,
  /** Prefix increment */
  preInc,
  /** Postfix increment */
  postInc,
  /** Prefix increment */
  preDec,
  /** Postfix increment */
  postDec,
  eq,
  gt,
  lt,
  neq,
  gte,
  lte,
  ternary,
  bitAnd,
  bitOr,
  bitXor,
  /** Shift left */
  bitLeft,
  /** Shift right */
  bitRight,
  bitNot,
  assign,
  plusAssign,
  minusAssign,
  divAssign,
  multAssign,
  moduloAssign,
  bitAndAssign,
  bitOrAssign,
  bitXorAssign,
  bitLeftAssign,
  bitRightAssign,
};

export { ArrayC as TcArray } from "./array";
export { Func } from "./func";
export { Pointer } from "./pointer";
export { Struct } from "./struct";

export * from "./types";
