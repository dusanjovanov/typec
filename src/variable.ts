import { Address } from "./address";
import { addressOf, assign } from "./operators";
import type { AutoSimpleSpecifier, SimpleSpecifier, StringLike } from "./types";
import { Value } from "./value";

/** Create a variable for a simple type. */
export class Variable<T extends SimpleSpecifier> {
  constructor(type: SimpleType<T>, name: string) {
    this.type = type;
    this.name = name;
  }
  type;
  name;

  /** Returns the address of this variable. */
  address() {
    return new Address(this.type.specifier, addressOf(this.name));
  }

  /** Returns the value of this variable ( its name wrapped in a Value ). */
  value() {
    return new Value(this.type.specifier, this.name);
  }

  declare() {
    return `${this.type} ${this.name}`;
  }

  init(value: Value<T>) {
    return assign(this.declare(), value);
  }

  initEnt(entity: Variable<T>) {
    return assign(this.declare(), entity.value());
  }

  /** Assign a value. */
  assign(value: Value<T>) {
    return assign(this.name, value);
  }

  /** Assign a variable. */
  assignVar(variable: Variable<T>) {
    return assign(this.name, variable.value());
  }

  static type<T extends AutoSimpleSpecifier>(type: T) {
    return new SimpleType(type);
  }
}

export class SimpleType<T extends AutoSimpleSpecifier = any> {
  constructor(type: T) {
    this.specifier = type;
  }
  specifier;

  wrap(value: StringLike) {
    return new Value(this.specifier, value);
  }
}
