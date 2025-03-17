import { Pointer } from "./pointer";
import type { Simple } from "./simple";
import { AnyType } from "./types";
import { Variable } from "./variable";

export class Param<
  T extends Simple | Pointer = any,
  Name extends string = any
> extends Variable<T> {
  constructor(type: T, name: Name) {
    super(type, name);
  }

  static new<T extends Simple | Pointer, Name extends string = any>(
    type: T,
    name: Name
  ) {
    return new Param(type, name);
  }
}

export class VarArgsParam {
  type = new AnyType("...");

  static new() {
    return new VarArgsParam();
  }
}
