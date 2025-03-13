import type { AutoSimpleSpecifier } from "./types";

export class Address<T extends AutoSimpleSpecifier> {
  constructor(type: T, value: string) {
    this.type = type;
    this.value = value;
  }
  kind = "address" as const;
  type;
  value;

  toString() {
    return this.value;
  }

  static string(value: string) {
    return new Address("char", `"${value.replaceAll(/"/g, `\\"`)}"`);
  }
}
