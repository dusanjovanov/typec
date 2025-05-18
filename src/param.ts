import { Stat } from "./statement";
import { Type } from "./type";
import {
  type PointerQualifier,
  type TypeArg,
  type TypeQualifier,
} from "./types";
import { Var } from "./variable";

export class Param<S extends string, Name extends string> extends Var<S> {
  constructor(type: TypeArg<S>, name: Name) {
    super(type, name);
    this.name = name;
  }
  name;

  /** Returns the param declaration statement. */
  declare() {
    return Stat.paramDeclaration(this.type, this.name);
  }

  static int<Name extends string>(
    name: Name,
    typeQualifiers?: TypeQualifier[]
  ) {
    return Param.new(Type.int(typeQualifiers), name);
  }

  static char<Name extends string>(
    name: Name,
    typeQualifiers?: TypeQualifier[]
  ) {
    return Param.new(Type.char(typeQualifiers), name);
  }

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

  static float<Name extends string>(
    name: Name,
    typeQualifiers?: TypeQualifier[]
  ) {
    return Param.new(Type.float(typeQualifiers), name);
  }

  static double<Name extends string>(
    name: Name,
    typeQualifiers?: TypeQualifier[]
  ) {
    return Param.new(Type.double(typeQualifiers), name);
  }

  static bool<Name extends string>(
    name: Name,
    typeQualifiers?: TypeQualifier[]
  ) {
    return Param.new(Type.bool(typeQualifiers), name);
  }

  static new<S extends string, Name extends string>(
    type: TypeArg<S>,
    name: Name
  ) {
    return new Param(type, name);
  }
}
