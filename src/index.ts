import { block, chunk, curly } from "./chunk";
import { _if, ifOnly } from "./conditional";
import { _return, call, func, funcImpl, funcProto } from "./func";
import { gcc } from "./gcc";
import { includeRel, includeSys } from "./include";
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
  byPointer,
  byValue,
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
import { funcPointerDeclare } from "./pointer";
import { std } from "./std";
import { _while, join, joinWithPrefix, str } from "./utils";
import { arrInit, arrVariable, variable } from "./variable";

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
  _while,
  /** Returns a function prototype statement */
  funcProto: funcProto,
  /** Returns a function definition statement */
  funcDef: funcImpl,
  funcPointerDeclare,
  /**
   * Returns a function call expression.
   */
  call,
  /**
   * Returns an object which has the definition, prototype and a call helper for that function.
   */
  func,

  /** Return statement */
  return: _return,
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
  arrVar: arrVariable,
  /**
   * Returns an array variable declaration with initialization.
   */
  arrInit,
  /** Shortcuts for standard C libraries */
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
  /** -> operator */
  dotRef: byPointer,
  /** . ( dot ) operator */
  dotVal: byValue,
};
