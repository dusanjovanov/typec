import { addressOf, assign } from "./operators";
import { Address } from "./pointer";
import type { AutoSpecifier, StringLike } from "./types";

/** Create a variable for a simple type. */
export class Var<T extends AutoSpecifier> {
  constructor(type: VarType<T>, name: string) {
    this.type = type;
    this.name = name;
  }
  type;
  name;

  /** Returns the address of this variable. */
  addr() {
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

  static type<T extends AutoSpecifier>(type: T) {
    return new VarType(type);
  }

  static new<T extends VarType<any>>(type: T, name: string) {
    return new Var(type, name);
  }
}

export class VarType<const T extends AutoSpecifier = any> {
  constructor(specifier: T) {
    this.specifier = specifier;
  }
  kind = "type" as const;
  specifier;

  wrap(value: StringLike) {
    return new Value<T>(this.specifier, value);
  }
}

export class Value<T extends AutoSpecifier> {
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
}
