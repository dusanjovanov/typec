import { addressOf, assign } from "./operators";
import { Address, Pointer, PointerType } from "./pointer";
import type { TypeSpecifier } from "./types";
import { Var, VarType } from "./variable";

export class Arr<const T extends VarType, Length extends number> {
  constructor(elementType: T, name: string, length: Length) {
    this.elementType = elementType;
    this.name = name;
    this.length = length;
    this.type = Arr.type(elementType, length) as VarType<`${T extends VarType<
      infer S
    >
      ? S
      : any} [${Length}]`>;
  }
  type;
  elementType;
  name;
  length;

  addr() {
    return new Address(
      `${this.elementType.specifier} [${this.length}]`,
      addressOf(this.name)
    ) as Address<`${T extends VarType<infer S> ? S : any} [${Length}]`>;
  }

  /** Returns the array declaration. */
  declare() {
    return `${this.elementType} ${this.name}[${this.length}]`;
  }

  /** Returns the array initialization. */
  init(value: any) {
    return assign(`${this.elementType} ${this.name}[]`, value);
  }

  static type<const T extends VarType | PointerType, Length extends number>(
    elementType: T,
    length: Length
  ) {
    return new VarType(`${elementType.specifier} [${length}]`);
  }

  static pointerType<T extends VarType | PointerType, Length extends number>(
    elementType: T,
    length: Length
  ) {
    return new PointerType(`${elementType} [${length}]`);
  }
}

new Arr(Var.type("int"), "my_arr", 10).addr;

new Var(Var.type("bool"), "bla").addr();

new Pointer(Arr.pointerType(Var.type("char"), 5), "ptr").addr();
