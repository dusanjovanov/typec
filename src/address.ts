import type { ArrayType } from "./array";
import type { FuncType } from "./func";
import type { Pointer } from "./pointer";
import { Simple } from "./simple";
import type { StructType } from "./struct";

/** A value container containing an rvalue expression which resolves to an address to a data type.  */
export class Address<
  T extends Simple | ArrayType | FuncType | Pointer | StructType
> {
  constructor(type: T, value: string) {
    this.type = type;
    this.value = value;
  }
  kind = "address" as const;
  type;
  value;

  toString() {
    return String(this.value);
  }

  /** Address to a char in the string. */
  static string(value: string) {
    return Address.new(Simple.type("char"), value);
  }

  static new<
    T extends Simple | ArrayType | FuncType | Pointer | StructType
  >(type: T, value: string) {
    return new Address(type, value);
  }
}
