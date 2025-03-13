import { Address } from "./address";
import { curly } from "./chunk";
import { addressOf, assign } from "./operators";
import type { PointerType } from "./pointer";
import type { Simple } from "./simple";
import type { PassingValue } from "./types";
import { joinArgs } from "./utils";

export class ArrayC<
  const ElementType extends Simple | PointerType,
  Length extends number
> {
  constructor(elementType: ElementType, length: Length, name: string) {
    this.elementType = elementType;
    this.name = name;
    this.length = length;
    this.type = ArrayC.type(elementType, length);
  }
  type;
  elementType;
  name;
  length;

  address() {
    return new Address(this.type, addressOf(this.name));
  }

  /** Returns the array declaration. */
  declare() {
    return `${this.elementType} ${this.name}[${this.length}]`;
  }

  /** Returns the array initialization. */
  init(value: PassingValue) {
    return assign(this.declare(), value);
  }

  static type<const T extends Simple | PointerType, Length extends number>(
    elementType: T,
    length: Length
  ) {
    return new ArrayType(elementType, length);
  }

  /** Returns an array compund literal expression. */
  static compound(values: PassingValue[]) {
    return curly(joinArgs(values));
  }

  /** Returns an array designated literal expression. */
  static designated(values: Record<number, PassingValue>) {
    return curly(
      joinArgs(
        Object.entries(values).map(([index, value]) => `[${index}] = ${value}`)
      )
    );
  }
}

export class ArrayType<
  T extends Simple | PointerType = any,
  Length extends number = any
> {
  constructor(elementType: T, length: Length) {
    this.elementType = elementType;
    this.length = length;
    this.specifier = `${this.elementType.specifier} [${this.length}]`;
  }
  elementType;
  length;
  specifier;
}
