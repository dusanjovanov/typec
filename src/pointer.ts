import { Address } from "./address";
import type { ArrayType } from "./array";
import type { FuncType } from "./func";
import { Operator } from "./operators";
import type { Simple } from "./simple";
import type { SimpleSpecifier } from "./types";
import { Value } from "./value";
import { Variable } from "./variable";

/** Create a pointer to any value. */
export class Pointer<T extends Simple | ArrayType<any, any> = any> {
  constructor(type: T, name: string) {
    this.type = type;
    this.name = name;
  }
  type;
  name;

  /** Returns the address of the pointer itself. */
  address() {
    return new Address(this.type, Operator.addressOf(this.name));
  }

  /** Returns the dereferenced value of the pointer. */
  value() {
    return new Value(this.type as any, Operator.valueOf(this.name)) as Value<
      T extends SimpleSpecifier ? T : never
    >;
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

  static type<T extends Simple | ArrayType<any, any> = any>(type: T) {
    return new PointerType(type);
  }
}

export class PointerType<T extends Simple | ArrayType | FuncType = any> {
  constructor(type: T) {
    this.type = type;
    this.specifier = this.type.specifier as string;
  }
  type;
  specifier;

  wrap(value: string) {
    return new Address(this.type, value);
  }
}
