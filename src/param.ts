import { Type } from "./type";
import { type PointerQualifier, type TypeQualifier } from "./types";
import { Variable } from "./variable";

export class Param<Name extends string = any> extends Variable {
  constructor(type: Type, name: Name) {
    super(type, name);
    this.name = name;
  }
  name;

  static size_t<Name extends string>(
    name: Name,
    typeQualifiers?: TypeQualifier[]
  ) {
    return Param.new(Type.size_t(typeQualifiers), name);
  }

  /** Param for char*. */
  static string<Name extends string>(
    name: Name,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Param.new(Type.string(typeQualifiers, pointerQualifiers), name);
  }

  static ptrInt<Name extends string>(
    name: Name,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Param.new(Type.ptrInt(typeQualifiers, pointerQualifiers), name);
  }

  static new<T extends Type, Name extends string = any>(type: T, name: Name) {
    return new Param(type, name);
  }
}
