import { Lit } from "./literal";
import { Operator } from "./operators";
import { Type } from "./type";
import type { CodeLike } from "./types";
import { Value } from "./value";

/** Used for creating array variables. */
export class Array {
  constructor(elementType: Type, length: number, name: string) {
    this.elementType = elementType;
    this.name = name;
    this.length = length;
    this.type = Type.array(elementType, length);
  }
  type;
  elementType;
  name;
  length;

  /** Returns the ref expression for the first element of the array. */
  ref() {
    return Value.new(this.name);
  }

  /** Returns the address expression for the entire array. */
  refArray() {
    return Operator.ref(this.name);
  }

  /** Returns the array declaration. */
  declare() {
    return `${this.elementType} ${this.name}[${this.length}]`;
  }

  /** Returns the array initialization with a compound literal. */
  init(...values: CodeLike[]) {
    return Operator.assign(this.declare(), Lit.compound(...values)).toString();
  }

  /** Returns an array initialization with a designated initializer. */
  initDesignated(values: Record<number, CodeLike>) {
    return Operator.assign(
      this.declare(),
      Lit.designatedSub(values)
    ).toString();
  }

  toString() {
    return this.name;
  }

  static new(elementType: Type, length: number, name: string) {
    return new Array(elementType, length, name);
  }

  static int<Length extends number>(length: Length, name: string) {
    return Array.new(Type.int(), length, name);
  }
}
