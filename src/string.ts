import { Address } from "./address";
import { Simple } from "./simple";
import { StdString } from "./std";

/**
 * Helper class for working with strings.
 *
 * Accepts an address to a char - could be a string literal or a `char*` variable or function parameter.
 *
 * Uses `stdlib` str functions and binds their first char* argument to the passed address expression.
 */
export class String {
  constructor(charAddress: Address<Simple<"char">>) {
    this.addr = charAddress;
  }
  addr;

  length() {
    return StdString.strlen.call([this.addr]);
  }

  concat(str: string) {
    return StdString.strcat.call([this.addr, Address.string(str)]);
  }

  includes() {
    //
  }
}
