import { addressOf, assign } from "./operators";
import { Address } from "./pointer";
import type { AutoSimpleSpecifier } from "./types";

export class Arr<const T extends AutoSimpleSpecifier, Length extends number> {
  constructor(elementType: T, length: Length, name: string) {
    this.elementType = elementType;
    this.name = name;
    this.length = length;
    this.type = Arr.type(elementType, length);
  }
  type;
  elementType;
  name;
  length;

  address() {
    return new Address(
      `${this.elementType} [${this.length}]`,
      addressOf(this.name)
    );
  }

  /** Returns the array declaration. */
  declare() {
    return `${this.elementType} ${this.name}[${this.length}]`;
  }

  /** Returns the array initialization. */
  init(value: any) {
    return assign(`${this.elementType} ${this.name}[]`, value);
  }

  static type<const T extends AutoSimpleSpecifier, Length extends number>(
    elementType: T,
    length: Length
  ) {
    return new ArrType(elementType, length);
  }

  static pointerType<T extends AutoSimpleSpecifier, Length extends number>(
    elementType: T,
    length: Length
  ) {
    return `${elementType} (*)[${length}]` as const;
  }
}

export class ArrType<
  T extends AutoSimpleSpecifier = any,
  Length extends number = any
> {
  constructor(elementType: T, length: Length) {
    this.elementType = elementType;
    this.length = length;
    this.specifier = `${this.elementType} [${this.length}]` as const;
  }
  elementType;
  length;
  specifier;
}
