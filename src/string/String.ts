import { NULL } from "../constants";
import { lib } from "../lib";
import { Lit } from "../literal";
import { Operator } from "../operators";
import { stdstring } from "../std";
import type { CodeLike } from "../types";
import { Value } from "../value";
import { concat } from "./concat";
import { indexOf } from "./indexOf";
import { slice } from "./slice";

/** typec string library */
export const tcstring = lib({
  externals: [],
  internals: {
    concat,
    indexOf,
    slice,
  },
});

/**
 * Helper class for working with strings that mimics the JS String class.
 *
 * Accepts a `char*` value expression - could be a string literal or a char* variable, or function param.
 *
 * Uses the standard `string.h` library and `tcstring` library functions and binds their first char* argument to the passed char* expression.
 */
export class String {
  constructor(strExp: CodeLike) {
    this.str = Value.new(strExp);
  }
  /** The Value of the passed char* expression. */
  str;

  /** Returns the length of the string. */
  get length() {
    return stdstring.strlen.call(this.str);
  }

  /** Returns a string that contains the concatenation of two or more strings. */
  concat(...strings: CodeLike[]) {
    return concat.call(this.str, ...strings);
  }

  /**
   * Returns true if this string contains the passed string starting from position ( default 0 ), otherwise false.
   */
  includes(searchString: CodeLike, position: CodeLike = 0) {
    return Operator.notEqual(
      stdstring.strstr.call(this.str.plus(position), searchString),
      NULL
    );
  }

  /** Returns the character at the specified index. */
  charAt(pos: CodeLike) {
    return Operator.subscript(this.str, pos);
  }

  /**
   * Returns the index of the first occurrence of a string, or -1 if not found.
   *
   * @param searchString — The substring to search for in the string
   *
   * @param position — The index at which to begin searching the String object. If omitted, search starts at the beginning of the string.
   */
  indexOf(searchString: CodeLike, position: CodeLike = 0) {
    return indexOf.call(this.str, searchString, position);
  }

  /**
   * Extracts a section of a string from start to end (exclusive) and returns a new string.
   */
  slice(start: CodeLike, end: CodeLike) {
    return slice.call(this.str, start, end);
  }

  /** Creates a new Value with Lit.string */
  static literal(str: string) {
    return Value.new(Lit.string(str));
  }

  static new(charAddress: CodeLike) {
    return new String(charAddress);
  }
}
