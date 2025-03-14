import { Operator } from "./operators";
import { Simple } from "./simple";
import type { SimpleSpecifier } from "./types";
import { Value } from "./value";

/** Create a variable for a simple type. */
export class Variable<T extends SimpleSpecifier> {
  constructor(type: Simple<T>, name: string) {
    this.type = type;
    this.name = name;
  }
  type;
  name;

  /** Returns the address of this variable's value. */
  address() {
    return this.type.toAddress(Operator.addressOf(this.name));
  }

  /** Returns the value of this variable ( its name wrapped in a Value ). */
  value() {
    return this.type.toValue(this.name);
  }

  /** Returns the variable declaration statement. */
  declare() {
    return `${this.type.specifier} ${this.name}`;
  }

  /** Initialize with a value. */
  init(value: Value<T>) {
    return Operator.assign(this.declare(), value);
  }

  /** Assign a value. */
  assign(value: Value<T>) {
    return Operator.assign(this.name, value);
  }

  static new<T extends SimpleSpecifier>(type: Simple<T>, name: string) {
    return new Variable(type, name);
  }
}
