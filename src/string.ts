import { Address } from "./address";
import { Operator } from "./operators";
import { Pointer } from "./pointer";
import { StdLib, StdString } from "./std";
import { type ArrayIndex, type StringAddress } from "./types";
import { Value } from "./value";
import { Var } from "./variable";

/**
 * Helper class for working with strings that mimics the JS String class.
 *
 * Accepts an address to a char - could be a string literal or a `char*` variable or function parameter.
 *
 * Uses `stdlib` str functions and binds their first char* argument to the passed address expression.
 */
export class String {
  constructor(charAddress: StringAddress) {
    this.addr = charAddress;
  }
  addr;

  /** Returns the length of the string. */
  get length() {
    return StdString.strlen.call([this.addr]);
  }

  /** Returns a string that contains the concatenation of two or more strings. */
  concat(...strings: StringAddress[]) {
    let result = this.addr;
    for (const str of strings) {
      result = StdString.strcat.call([result, str]);
    }
    return result;
  }

  /**
   * Returns true if this string contains the passed string starting from position ( default 0 ), otherwise false.
   */
  includes(searchString: StringAddress, position: ArrayIndex = Value.int(0)) {
    return Operator.notEqual(
      StdString.strstr.call([this.addr.plus(position), searchString]),
      Address.null()
    );
  }

  /** Returns the character at the specified index. */
  charAt(pos: ArrayIndex) {
    return Value.char(Operator.subscript(this.addr, pos));
  }

  /**
   * Returns the index of the first occurrence of a string, or -1 if not found.
   *
   * @param searchString — The substring to search for in the string
   *
   * @param position — The index at which to begin searching the String object. If omitted, search starts at the beginning of the string.
   */
  indexOf(searchString: StringAddress, position: ArrayIndex = Value.int(0)) {
    const result = StdString.strstr.call([
      this.addr.plus(position),
      searchString,
    ]);
    return Value.int(
      Operator.ternary(
        Operator.equal(result, Address.null()),
        Value.int(-1),
        Operator.minus(result, this.addr)
      )
    );
  }

  /**
   * Extracts a section of a string from start to end (exclusive) and returns a new string.
   */
  slice(start: ArrayIndex, end?: ArrayIndex) {
    // const len = this.length;
    // const safeStart = Operator.max(Value.int(0), start); // Clamp start to 0
    // const safeEnd = end ? Operator.min(len, Operator.max(safeStart, end)) : len; // Default to length
    // const newLen = Operator.minus(safeEnd, safeStart); // Length of slice
    // const newAddr = Var.new(Pointer.string(), "sliceStr");
    // const alloc = `${newAddr.declare()} = ${StdLib.malloc.call([
    //   Operator.add(newLen, Value.int(1)),
    // ])}`;
    // const copy = StdString.strncpy.call([
    //   newAddr,
    //   this.addr.plus(safeStart),
    //   newLen,
    // ]);
    // const terminate = Operator.assign(
    //   Operator.subscript(newAddr, newLen),
    //   Value.char(0)
    // );
    // return Address.from(`${alloc}; ${copy}; ${terminate}`, newAddr);
  }

  /** Alias for `Address.stringLiteral` */
  static literal(str: string) {
    return Address.stringLiteral(str);
  }

  static new(charAddress: StringAddress) {
    return new String(charAddress);
  }
}

String.new(String.literal("abc")).charAt(Value.int(10));
