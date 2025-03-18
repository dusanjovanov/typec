import { Condition } from "./conditional";
import { Func } from "./func";
import { Loop } from "./loops";
import { Operator } from "./operators";
import { Param, VarArgsParam } from "./param";
import { Pointer } from "./pointer";
import type { Simple } from "./simple";
import { StdArg, StdLib, StdString } from "./std";
import {
  type ArrayIndexValue,
  type AssignArrayIndexValue,
  type IntegerType,
  type StringValue,
} from "./types";
import { Value } from "./value";
import { Variable } from "./variable";

/**
 * ```c
 * char* slice(const char* str, size_t start, size_t end)
 * ```
 */
export const slice = (() => {
  const slice = Func.new(Pointer.string(), "tc_str_slice", [
    Param.string("str", ["const"]),
    Param.size_t("start"),
    Param.new(Pointer.size_t(), "end"),
  ]);

  const len = Variable.size_t("len");
  const sliceLen = Variable.size_t("copyLen");
  const result = Variable.string("result");
  const endIdx = Variable.int("end_idx");

  const { str, start, end } = slice.params;

  slice.add(
    // Return NULL if input string is NULL
    Condition.if(str.equal(Value.null()), [Func.return(Value.null())]),
    // Get the length of the input string
    len.init(StdString.strlen.call([str])),
    // Clamp start index: ensure it's within [0, len]
    start.clamp(Value.int(0), len),
    // Determine end index: use string length if end is NULL, otherwise clamp
    endIdx.declare(),
    Condition.if(end.equal(Value.null()), [endIdx.assign(len)]).else([
      endIdx.assign(end.deRef()),
      endIdx.clamp(start, len),
    ]),
    // calculate length to copy
    sliceLen.init(end.minus(start)),
    // Allocate memory for the sliced string (+1 for null terminator)
    result.init(
      StdLib.malloc.call([len.plus(Value.int(1))]).cast(Pointer.string())
    ),
    Condition.if(result.equal(Value.null()), [Func.return(Value.null())]),
    // Copy the substring
    StdString.strncpy.call([result, str.plus(start), sliceLen]),
    // Ensure null termination
    result.subAssign(sliceLen, Value.nullTerm()),
    slice.return(result)
  );

  return slice;
})();

const concat = (() => {
  const concat = Func.new(
    Pointer.string(),
    "tc_str_concat",
    [Param.string("str", ["const"])],
    VarArgsParam.new()
  );

  const totalLen = Variable.size_t("total_len");
  const varArgs = StdArg.VarArgs.new();
  const nextStr = Variable.string("next_str", ["const"]);

  const { str } = concat.params;

  concat.add(
    // Return NULL if the initial string is NULL
    Condition.if(str.equal(Value.null()), [Func.return(Value.null())]),
    // Start with the length of the first string
    totalLen.init(StdString.strlen.call([str])),
    varArgs.init(str.name),
    nextStr.declare(),
    Loop.while(
      nextStr.assign(varArgs.nextArg(nextStr.type)).notEqual(Value.null()),
      [
        Condition.if(nextStr.notEqual(Value.null()), [
          totalLen.plusAssign(StdString.strlen.call([nextStr])),
        ]),
      ]
    )
  );

  return concat;
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
    this.addr = charAddress;
  }
  addr;

  /** Returns the length of the string. */
  get length() {
    return StdString.strlen.call([this.addr]);
  }

  /** Returns a string that contains the concatenation of two or more strings. */
  // TODO
  concat(...strings: StringValue[]) {
    let result = this.addr;
    for (const str of strings) {
      result = StdString.strcat.call([result, str]);
    }
    return result;
  }

  /**
   * Returns true if this string contains the passed string starting from position ( default 0 ), otherwise false.
   */
  includes(
    searchString: StringValue,
    position: ArrayIndexValue = Value.int(0)
  ) {
    return Operator.notEqual(
      StdString.strstr.call([this.addr.plus(position), searchString]),
      Value.null()
    );
  }

  /** Returns the character at the specified index. */
  charAt(pos: ArrayIndexValue) {
    return Value.char(Operator.subscript(this.addr, pos));
  }

  /**
   * Returns the index of the first occurrence of a string, or -1 if not found.
   *
   * @param searchString — The substring to search for in the string
   *
   * @param position — The index at which to begin searching the String object. If omitted, search starts at the beginning of the string.
   */
  indexOf(searchString: StringValue, position: ArrayIndexValue = Value.int(0)) {
    const result = StdString.strstr.call([
      this.addr.plus(position),
      searchString,
    ]);
    return Value.int(
      Operator.ternary(
        Operator.equal(result, Value.null()),
        Value.int(-1),
        Operator.minus(result, this.addr)
      )
    );
  }

  /**
   * Extracts a section of a string from start to end (exclusive) and returns a new string.
   */
  slice(
    start: AssignArrayIndexValue,
    end: Value<Pointer<Simple<IntegerType>>>
  ) {
    return slice.call([this.addr, start, end]);
  }

  /** Alias for `Address.stringLiteral` */
  static literal(str: string) {
    return Value.stringLiteral(str);
  }

  static new(charAddress: StringValue) {
    return new String(charAddress);
  }

  static slice = slice;
}
