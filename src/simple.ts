import type { AutoSimpleSpecifier, StringLike } from "./types";
import { Value } from "./value";

/** Simple type */
export class Simple<T extends AutoSimpleSpecifier = any> {
  constructor(type: T) {
    this.specifier = type;
  }
  specifier;

  wrap(value: StringLike) {
    return new Value(this.specifier, value);
  }

  static type<T extends AutoSimpleSpecifier>(type: T) {
    return new Simple(type);
  }
}
