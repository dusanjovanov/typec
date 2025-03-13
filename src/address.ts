import type { ArrayType } from "./array";
import type { FuncType } from "./func";
import { Simple } from "./simple";

export class Address<T extends Simple | ArrayType | FuncType> {
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
