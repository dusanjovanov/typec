import { addressOf, assign } from "./operators";
import { Address } from "./pointer";
import type { AutoSimpleSpecifier, SimpleSpecifier, StringLike } from "./types";

/** Create a variable for a simple type. */
export class Var<T extends SimpleSpecifier> {
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

  initEnt(entity: Var<T>) {
    return assign(this.declare(), entity.value());
  }

  /** Assign a value. */
  assign(value: Value<T>) {
    return assign(this.name, value);
  }

  /** Assign an entity. */
  assignEnt(entity: Var<T>) {
    return assign(this.name, entity.value());
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

export class Value<T extends AutoSimpleSpecifier> {
  constructor(type: T, value: StringLike) {
    this.type = type;
    this.value = value;
  }
  kind = "value" as const;
  type;
  value;

  toString() {
    return this.value;
  }

  static int(value: number) {
    return new Value("int", value);
  }
}
