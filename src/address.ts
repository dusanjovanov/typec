import type { ArrayType } from "./array";
import type { FuncType } from "./func";
import type { PointerType } from "./pointerType";
import { Simple } from "./simple";
import type { StructType } from "./struct";

export class Address<
  T extends Simple | ArrayType | FuncType | PointerType | StructType
> {
  constructor(type: T, value: string) {
    this.type = type;
    this.value = value;
  }
  kind = "address" as const;
  type;
  value;

  toString() {
    return this.value;
  }

  static string(value: string) {
    return new Address(
      Simple.type("char"),
      `"${value.replaceAll(/"/g, `\\"`)}"`
    );
  }
}
