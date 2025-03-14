import { Address } from "./address";
import { ArrayType } from "./array";
import { FuncType } from "./func";
import { Simple } from "./simple";
import { stringSplice } from "./utils";
import { Value } from "./value";

export class PointerType<
  T extends Simple | ArrayType | FuncType | PointerType = any
> {
  constructor(type: T) {
    this.type = type;

    if (this.type instanceof Simple) {
      this.specifier = `${this.type.specifier}*`;
    }
    //
    else if (this.type instanceof ArrayType) {
      this.specifier = stringSplice(
        this.type.specifier,
        this.type.specifier.indexOf("["),
        "(*)"
      );
    }
    //
    else if (this.type instanceof FuncType) {
      this.specifier = stringSplice(
        this.type.specifier,
        this.type.specifier.indexOf("("),
        "(*)"
      );
    }
    //
    else {
      this.specifier = stringSplice(
        this.type.specifier,
        this.type.specifier.indexOf("*"),
        "*"
      );
    }
  }

  type: T;
  specifier;

  toAddress(value: string) {
    return new Address(this, value);
  }

  toValue(value: string) {
    return new Value(this.type.specifier, value) as Value<T["specifier"]>;
  }
}
