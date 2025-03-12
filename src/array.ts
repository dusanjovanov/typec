import { addressOf, assign } from "./operators";
import { Type } from "./type";
import type { AutoSpecifier, StringLike } from "./types";
import { joinArgs } from "./utils";

export class TcArray {
  constructor(elementType: AutoSpecifier, name: string, len: number) {
    this.elementType = elementType;
    this.name = name;
    this.len = len;
    this.type = Type.arr(elementType, len);
  }
  type;
  elementType;
  name;
  len;

  addr() {
    return addressOf(this.name);
  }

  /** Returns the array declaration. */
  declare() {
    return `${this.elementType} ${this.name}[${this.len}]`;
  }

  /** Returns the array initialization. */
  init(value: StringLike[]) {
    return assign(`${this.elementType} ${this.name}[]`, `{${joinArgs(value)}}`);
  }
}

export const array = (
  elementType: AutoSpecifier,
  name: string,
  len: number
) => {
  return new TcArray(elementType, name, len);
};
