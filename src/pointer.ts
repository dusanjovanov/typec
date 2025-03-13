import type { ArrType } from "./array";
import { addressOf, assign, valueOf } from "./operators";
import type { AutoSimpleSpecifier, SimpleSpecifier } from "./types";
import { SimpleType, Value, Var } from "./variable";

/** Create a pointer. */
export class Pointer<T extends SimpleType | ArrType<any, any> = any> {
  constructor(type: T, name: string) {
    this.type = type;
    this.name = name;
  }
  type;
  name;

  /** Returns the address of the pointer itself. */
  address() {
    return new Address(this.type.specifier, addressOf(this.name)) as Address<
      T["specifier"]
    >;
  }

  /** Returns the dereferenced value of the pointer. */
  value() {
    return new Value(this.type as any, valueOf(this.name)) as Value<
      T extends SimpleSpecifier ? T : never
    >;
  }

  declare() {
    return `${this.type}* ${this.name}`;
  }

  /** Assign an entity to this pointer. */
  assign(entity: Var<SimpleSpecifier> | Pointer<T>) {
    return assign(this.name, entity.address());
  }

  /** Assign an address. */
  assignAddress(address: Address<T["specifier"]>) {
    return assign(this.name, address);
  }

  static type<T extends SimpleType | ArrType<any, any> = any>(type: T) {
    return new PointerType(type);
  }
}

export class PointerType<T extends SimpleType | ArrType<any, any> = any> {
  constructor(type: T) {
    this.specifier = type.specifier;
  }
  specifier;

  wrap(value: string) {
    return new Address(this.specifier, value);
  }
}

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
