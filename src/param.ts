import { Pointer } from "./pointer";
import { Simple } from "./simple";
import { AnyType, type PointerQualifier, type TypeQualifier } from "./types";
import { Variable } from "./variable";

export class Param<
  T extends Simple | Pointer = any,
  Name extends string = any
> extends Variable<T> {
  constructor(type: T, name: Name) {
    super(type, name);
    this._name = name;
  }
  _name;

  static size_t<Name extends string>(
    name: Name,
    typeQualifiers?: TypeQualifier[]
  ) {
    return Param.new(Simple.size_t(typeQualifiers), name);
  }

  /** Pointer variable for char*. */
  static string<Name extends string>(
    name: Name,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Param.new(Pointer.string(typeQualifiers, pointerQualifiers), name);
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
