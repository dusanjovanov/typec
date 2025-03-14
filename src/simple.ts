import { Address } from "./address";
import type { AutoSimpleSpecifier, StringLike, TypeQualifier } from "./types";
import { Value } from "./value";

/** Simple type */
export class Simple<T extends AutoSimpleSpecifier = any> {
  constructor(specifier: T, qualifiers?: TypeQualifier[]) {
    this.specifier = specifier;
    this.qualifiers = qualifiers;
  }
  specifier;
  qualifiers;

  toValue(value: StringLike) {
    return new Value(this.specifier, value);
  }

  toAddress(value: string) {
    return new Address(this, value);
  }

  static type<T extends AutoSimpleSpecifier>(
    type: T,
    qualifiers?: TypeQualifier[]
  ) {
    return new Simple(type, qualifiers);
  }
}
