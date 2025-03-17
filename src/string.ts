import { Address } from "./address";
import { Condition } from "./conditional";
import { Func } from "./func";
import { Operator } from "./operators";
import { Param } from "./param";
import { Pointer } from "./pointer";
import { Simple } from "./simple";
import { StdString } from "./std";
import { type ArrayIndex, type StringAddress } from "./types";
import { Utils } from "./utils";
import { Value } from "./value";
import { Variable } from "./variable";

export const slice = Func.new(Pointer.string(), "tc_str_slice", [
  Param.new(Pointer.string(["const"]), "str"),
  Param.new(Pointer.string(), "result"),
  Param.new(Simple.size_t(), "start"),
  Param.new(Simple.size_t(), "end"),
]);

const lenVar = Variable.size_t("len");
const copyLenVar = Variable.size_t("copyLen");

slice.add([
  lenVar.init(StdString.strlen.call([slice.byName.str.address()])),
  // clamp indices
  slice.byName.start.assign(
    Value.size_t(Utils.min(slice.byName.start.value(), lenVar.value()))
  ),
  slice.byName.end.assign(
    Value.size_t(Utils.min(slice.byName.end.value(), lenVar.value()))
  ),
  Condition.if_only(
    Operator.greaterThan(slice.byName.start.value(), slice.byName.end.value()),
    [Func.return(3)]
  ),
  // calculate length to copy
  copyLenVar.init(slice.byName.end.minus(slice.byName.start.value())),
]);

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
    //
  }

  /** Alias for `Address.stringLiteral` */
  static literal(str: string) {
    return Address.stringLiteral(str);
  }

  static new(charAddress: StringAddress) {
    return new String(charAddress);
  }

  static slice = slice;
}
