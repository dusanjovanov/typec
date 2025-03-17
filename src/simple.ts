import { Address } from "./address";
import type { AutoSimpleSpecifier, StringLike, TypeQualifier } from "./types";
import { emptyFalsy, join } from "./utils";
import { Value } from "./value";

/** Simple type */
export class Simple<T extends AutoSimpleSpecifier = any> {
  constructor(specifier: T, qualifiers: TypeQualifier[] = []) {
    this.specifier = specifier;
    this.qualifiers = qualifiers;

    this.full = `${emptyFalsy(
      qualifiers.length > 0,
      () => `${join(qualifiers)} `
    )}${this.specifier}`;
  }
  specifier;
  qualifiers;
  full;

  toValue(value: StringLike) {
    return new Value(this, value);
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

  static int(qualifiers?: TypeQualifier[]) {
    return Simple.type("int", qualifiers);
  }

  static size_t(qualifiers?: TypeQualifier[]) {
    return Simple.type("size_t", qualifiers);
  }

  static void(qualifiers?: TypeQualifier[]) {
    return Simple.type("void", qualifiers);
  }

  static char(qualifiers?: TypeQualifier[]) {
    return Simple.type("char", qualifiers);
  }
}
