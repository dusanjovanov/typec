import { semicolon } from "./chunk";
import { JsArray } from "./js";
import { Lit } from "./literal";
import { Operator } from "./operators";
import { RValue } from "./rValue";
import { Type } from "./type";
import type { CodeLike } from "./types";
import { Value } from "./value";

/** Used for creating array variables. */
export class Array extends RValue {
  constructor(elementType: Type, name: string, length?: number | number[]) {
    super(name);
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
    let str = `${this.elementType} ${this.name}`;

    if (this.length == null) {
      str += "[]";
    }
    //
    else if (JsArray.isArray(this.length)) {
      str += this.length.map((l) => `[${l}]`).join("");
    }
    //
    else {
      str += `[${this.length}]`;
    }

    return str;
  }

  /** Initialize with a value. */
  init(value: CodeLike) {
    return Operator.assign(this.declare(), value);
  }

  /** Returns the array initialization with a compound literal. */
  initCompound(...values: CodeLike[]) {
    return Operator.assign(this.declare(), semicolon(Lit.compound(...values)));
  }

  /** Returns an array initialization with a designated initializer. */
  initDesignated(values: Record<number, CodeLike>) {
    return Operator.assign(
      this.declare(),
      semicolon(Lit.designatedSub(values))
    );
  }

  toString() {
    return this.name;
  }

  static new(elementType: Type, name: string, length?: number | number[]) {
    return new Array(elementType, name, length);
  }
}
