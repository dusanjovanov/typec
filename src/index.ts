import { arr } from "./array";
import { block, chunk, curly } from "./chunk";
import { _if, ifOnly } from "./conditional";
import { func } from "./func";
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
import { std } from "./std";
import { join, joinWithPrefix, str } from "./utils";
import { variable } from "./variable";

export * from "./types";

export const tc = {
  /** Takes in an array of statements as strings and adds semicolons and new lines appropriately. */
  chunk,
  /** Statements ( chunk ) between curly braces and adds new lines. */
  curly,
  /** Chunk of code within curly braces. */
  block,
  /** #include "" */
  includeRel,
  /** #include <> */
  includeSys,
  /** Returns a variable declaration statement and optionally an assignment. */
  variable,
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
   * Returns an object which has the definition, prototype and a call helper for that function.
   */
  func,
  /**
   * Returns a string meant to be used as a string literal in c code.
   *
   * Surrounds the string with quotes and automatically escapes all quotes inside of the string.
   */
  str,
  /**
   * Returns a type cast expression.
   */
  cast,
  /**
   * Returns an array variable declaration without initialization.
   */
  arr,
  /** Functions and helpers for standard C libraries */
  std,
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
