import { Address } from "./address";
import { ArrayType } from "./array";
import { FuncType } from "./func";
import { Operator } from "./operators";
import { PointerType } from "./pointerType";
import { Simple } from "./simple";
import type { AutoSimpleSpecifier, SimpleSpecifier } from "./types";
import { Variable } from "./variable";

/** Create a pointer to any value. */
export class Pointer<
  T extends Simple | ArrayType | FuncType | PointerType = any
> {
  constructor(type: PointerType<T>, name: string) {
    this.type = type;
    this.name = name;
  }
  type;
  name;

  /** Returns the address of the pointer itself. */
  address() {
    return this.type.toAddress(Operator.addressOf(this.name));
  }

  /** Returns the dereferenced value of the pointer. */
  value() {
    return this.type.toValue(Operator.addressOf(this.name));
  }

  declare() {
    return `${this.type.specifier}* ${this.name}`;
  }

  /** Assign an entity to this pointer. */
  assign(entity: Variable<SimpleSpecifier> | Pointer<T>) {
    return Operator.assign(this.name, entity.address());
  }

  /** Assign an address. */
  assignAddress(address: Address<T["specifier"]>) {
    return Operator.assign(this.name, address);
  }

  static type<T extends Simple | ArrayType | FuncType = any>(type: T) {
    return new PointerType(type);
  }

  static simple<T extends AutoSimpleSpecifier>(type: T) {
    return Pointer.type(new Simple(type));
  }
}
