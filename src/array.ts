import { Address } from "./address";
import { curly } from "./chunk";
import { Literal } from "./literal";
import { Operator } from "./operators";
import type { Pointer } from "./pointer";
import { Simple } from "./simple";
import type { PassingValue, TypeToValueContainer } from "./types";
import { joinArgs } from "./utils";

/** Used for creating array variables. */
export class Array<
  const ElementType extends Simple | Pointer,
  Length extends number
> {
  constructor(elementType: ElementType, length: Length, name: string) {
    this.elementType = elementType;
    this.name = name;
    this.length = length;
    this.type = Array.type(elementType, length);
  }
  type;
  elementType;
  name;
  length;

  /** Returns the address expression for the first element of the array. */
  address() {
    return this.elementType.toAddress(this.name) as Address<ElementType>;
  }

  /** Returns the address expression for the entire array. */
  addressArray() {
    return this.type.toAddress(Operator.addressOf(this.name));
  }

  /** Returns the array declaration. */
  declare() {
    return `${this.elementType} ${this.name}[${this.length}]`;
  }

  /** Returns the array initialization with a compound literal. */
  init(values: TypeToValueContainer<ElementType>[]) {
    return Operator.assign(this.declare(), Literal.compound(values));
  }

  /** Returns an array initialization with a designated initializer. */
  initDesignated(values: Record<number, TypeToValueContainer<ElementType>>) {
    return Array.designated(values);
  }

  /** Returns an array designated initializer. */
  static designated(values: Record<number, PassingValue>) {
    return curly(
      joinArgs(
        Object.entries(values).map(([index, value]) => `[${index}] = ${value}`)
      )
    );
  }

  static type<const T extends Simple | Pointer, Length extends number>(
    elementType: T,
    length: Length
  ) {
    return new ArrayType(elementType, length);
  }

  static new<
    const ElementType extends Simple | Pointer,
    Length extends number
  >(elementType: ElementType, length: Length, name: string) {
    return new Array(elementType, length, name);
  }

  static int<Length extends number>(length: Length, name: string) {
    return Array.new(Simple.int(), length, name);
  }
}

export class ArrayType<
  ElementType extends Simple | Pointer = any,
  Length extends number = any
> {
  constructor(elementType: ElementType, length: Length) {
    this.elementType = elementType;
    this.length = length;
    this.specifier = `${this.elementType.specifier} [${this.length}]`;
  }
  elementType;
  length;
  specifier;

  toAddress(value: string) {
    return new Address(this, value);
  }

  static new<
    ElementType extends Simple | Pointer = any,
    Length extends number = any
  >(elementType: ElementType, length: Length) {
    return new ArrayType(elementType, length);
  }

  static int<Length extends number>(length: Length) {
    return ArrayType.new(Simple.int(), length);
  }
}
