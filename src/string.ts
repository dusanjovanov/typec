import { Condition } from "./conditional";
import { Func } from "./func";
import { Operator } from "./operators";
import { Param } from "./param";
import { Pointer } from "./pointer";
import { StdLib, StdString } from "./std";
import { type ArrayIndexValue, type StringValue } from "./types";
import { Value } from "./value";
import { Variable } from "./variable";

export const slice = (() => {
  const slice = Func.new(Pointer.string(), "tc_str_slice", [
    Param.string("str", ["const"]),
    Param.size_t("start"),
    Param.size_t("end"),
  ]);

  const lenVar = Variable.size_t("len");
  const copyLenVar = Variable.size_t("copyLen");
  const resultVar = Variable.string("result");

  slice.add([
    lenVar.init(StdString.strlen.call([slice.params.str])),
    // clamp indices
    slice.params.start.assign(slice.params.start.min(lenVar)),
    slice.params.end.assign(slice.params.end.min(lenVar)),
    Condition.if(slice.params.start.greaterThan(slice.params.end), [
      Func.return(3),
    ]),
    // calculate length to copy
    copyLenVar.init(slice.params.end.minus(slice.params.start.name())),
    // Allocate memory for the sliced string (+1 for null terminator)
    resultVar.init(
      StdLib.malloc.call([lenVar.plus(Value.int(1))]).cast(Pointer.string())
    ),
    Condition.if(resultVar.equal(Value.null()), [Func.return(Value.null())]),
    // Copy the substring
  ]);

  return slice;
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
  slice(start: ArrayIndexValue, end?: ArrayIndexValue) {
    //
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
