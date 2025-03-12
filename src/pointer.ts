import { addressOf, assign, valueOf } from "./operators";
import type { AutoSpecifier } from "./types";
import { Value, Var } from "./variable";

/** Create a pointer for a simple type. */
export class Pointer<T extends AutoSpecifier> {
  constructor(type: PointerType<T>, name: string) {
    this.type = type;
    this.name = name;
  }
  type;
  name;

  /** Returns the address of the pointer itself. */
  addr() {
    return new Address(this.type.specifier, addressOf(this.name));
  }

  /** Returns the dereferenced value of the pointer. */
  value() {
    return new Value(this.type.specifier, valueOf(this.name));
  }

  declare() {
    return `${this.type}* ${this.name}`;
  }

  /** Assign an entity to this pointer. */
  assign(entity: Var<T> | Pointer<T>) {
    return assign(this.name, entity.addr());
  }

  /** Assign an address. */
  assignAddress(address: Address<T>) {
    return assign(this.name, address);
  }

  static type<T extends AutoSpecifier>(type: T) {
    return new PointerType(type);
  }

  static new<T extends PointerType>(type: T, name: string) {
    return new Pointer(type, name);
  }
}

export class PointerType<T extends AutoSpecifier = any> {
  constructor(specifier: T) {
    this.specifier = specifier;
  }
  kind = "pointer" as const;
  specifier;

  wrap(value: string) {
    return new Address<T>(this.specifier, value);
  }
}

export class Address<T extends AutoSpecifier> {
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
}
