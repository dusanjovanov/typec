import { Type } from "./type";
import { type PointerQualifier, type TypeQualifier } from "./types";
import { Var } from "./variable";

export class Param<Name extends string = any> extends Var {
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

  static pointerInt<Name extends string>(
    name: Name,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Param.new(Type.intPointer(typeQualifiers, pointerQualifiers), name);
  }

  static new<Name extends string = any>(type: Type, name: Name) {
    return new Param(type, name);
  }
}
