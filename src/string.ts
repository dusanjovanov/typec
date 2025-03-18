import { Condition } from "./condition";
import { NULL, NULL_TERM } from "./constants";
import { Func } from "./func";
import { Literal } from "./literal";
import { Loop } from "./loops";
import { Operator } from "./operators";
import { Param } from "./param";
import { StdArg, StdLib, StdString } from "./std";
import { Type } from "./type";
import {
  type ArrayIndex,
  type ArrayIndexPointer,
  type CodeLike,
  type StringValue,
} from "./types";
import { Value } from "./value";
import { Variable } from "./variable";

export const slice = (() => {
  const slice = Func.new(Type.string(), "tc_str_slice", [
    Param.string("str", ["const"]),
    Param.size_t("start"),
    Param.new(Type.size_t(), "end"),
  ]);

  const len = Variable.size_t("len");
  const sliceLen = Variable.size_t("copyLen");
  const result = Variable.string("result");
  const endIdx = Variable.int("end_idx");

  const { str, start, end } = slice.params;

  slice.add(
    // Return NULL if input string is NULL
    str.equalReturn(NULL),
    // Get the length of the input string
    len.init(StdString.strlen.call([str])),
    // Clamp start index: ensure it's within [0, len]
    start.clamp(0, len),
    // Determine end index: use string length if end is NULL, otherwise clamp
    endIdx.declare(),
    Condition.if(end.equal(NULL), [endIdx.assign(len)]).else([
      endIdx.assign(end.deRef()),
      endIdx.clamp(start, len),
    ]),
    // calculate length to copy
    sliceLen.init(end.minus(start)),
    // Allocate memory for the sliced string (+1 for null terminator)
    result.init(StdLib.malloc.call([len.plus(1)]).cast(Type.string())),
    // Return NULL if allocation fails
    result.equalReturn(NULL),
    // Copy the substring
    StdString.strncpy.call([result, str.plus(start), sliceLen]),
    // Ensure null termination
    result.subAssign(sliceLen, NULL_TERM),
    slice.return(result)
  );

  return slice;
})();

const concat = (() => {
  const concat = Func.new(
    Type.string(),
    "tc_str_concat",
    [Param.string("str", ["const"])],
    true
  );

  const totalLen = Variable.size_t("total_len");
  const varArgs = StdArg.VarArgs.new();
  const nextStr = Variable.string("next_str", ["const"]);
  const result = Variable.string("result");

  const { str } = concat.params;

  concat.add(
    // Return NULL if the initial string is NULL
    str.equalReturn(NULL),
    // Start with the length of the first string
    totalLen.init(StdString.strlen.call([str])),
    varArgs.declare(),
    varArgs.start(str),
    nextStr.declare(),
    Loop.while(nextStr.assign(varArgs.nextArg(nextStr.type)).notEqual(NULL), [
      // Double-check to avoid issues with NULL in list
      Condition.if(nextStr.notEqual(NULL), [
        totalLen.plusAssign(StdString.strlen.call([nextStr])),
      ]),
    ]),
    varArgs.end(),
    // Allocate memory for the result (+1 for null terminator)
    result.init(StdLib.malloc.call([totalLen.plus(1)])),
    result.equalReturn(NULL),
    // Copy the first string
    StdString.strcpy.call([result, str]),
    // Second pass: Concatenate all additional strings
    varArgs.start(str),
    Loop.while(nextStr.assign(varArgs.nextArg(nextStr.type)).notEqual(NULL), [
      Condition.if(nextStr.notEqual(NULL), [
        StdString.strcat.call([result, nextStr]),
      ]),
    ]),
    varArgs.end(),
    concat.return(result)
  );

  return concat;
})();

const indexOf = (() => {
  // const indexOf = Func.new();
  // const result = StdString.strstr.call([
  //   this.addr.plus(position),
  //   searchString,
  // ]);
  // return Value.int(
  //   Operator.ternary(
  //     Operator.equal(result, Value.null()),
  //     -1,
  //     Operator.minus(result, this.addr)
  //   )
  // );
})();

/**
 * Helper class for working with strings that mimics the JS String class.
 *
 * Accepts an address to a char - could be a string literal or a `char*` variable or function parameter.
 *
 * Uses `stdlib` str functions and binds their first char* argument to the passed address expression.
 */
export class String {
  constructor(charAddress: StringValue) {
    this.addr = Value.new(charAddress);
  }
  addr;

  /** Returns the length of the string. */
  get length() {
    return StdString.strlen.call([this.addr]);
  }

  /** Returns a string that contains the concatenation of two or more strings. */
  concat(...strings: StringValue[]) {
    return concat.call([this.addr, ...strings]);
  }

  /**
   * Returns true if this string contains the passed string starting from position ( default 0 ), otherwise false.
   */
  includes(searchString: StringValue, position: CodeLike = 0) {
    return Operator.notEqual(
      StdString.strstr.call([this.addr.plus(position), searchString]),
      NULL
    );
  }

  /** Returns the character at the specified index. */
  charAt(pos: CodeLike) {
    return Value.new(Operator.subscript(this.addr, pos));
  }

  /**
   * Returns the index of the first occurrence of a string, or -1 if not found.
   *
   * @param searchString — The substring to search for in the string
   *
   * @param position — The index at which to begin searching the String object. If omitted, search starts at the beginning of the string.
   */
  indexOf(searchString: StringValue, position: CodeLike = 0) {
    //
  }

  /**
   * Extracts a section of a string from start to end (exclusive) and returns a new string.
   */
  slice(start: ArrayIndex, end: ArrayIndexPointer) {
    return String.slice.call([this.addr, start, end]);
  }

  /** Creates a new Value with Literal.string */
  static literal(str: string) {
    return Value.new(Literal.string(str));
  }

  static new(charAddress: StringValue) {
    return new String(charAddress);
  }

  static slice = slice;
  static concat = concat;
}
