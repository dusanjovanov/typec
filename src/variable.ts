import { addressOf, assign } from "./operators";
import type { AutoSpecifier, StringLike } from "./types";

export class Variable {
  constructor(type: AutoSpecifier, name: string) {
    this.type = type;
    this.name = name;
  }
  type;
  name;

  addr() {
    return addressOf(this.name);
  }

  declare() {
    return `${this.type} ${this.name}`;
  }

  /** Assign the value of a variable. */
  assignVar(varName: string) {
    return assign(this.name, varName);
  }

  /** Assign a value. */
  assignValue(value: StringLike) {
    return assign(this.name, value);
  }
}
