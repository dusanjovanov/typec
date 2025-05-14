import { Type } from "./type";
import {
  type PointerQualifier,
  type TypeArg,
  type TypeQualifier,
} from "./types";
import { Var } from "./variable";

export class Par<S extends string, Name extends string> extends Var<S> {
  constructor(type: TypeArg<S>, name: Name) {
    super(type, name);
    this.name = name;
  }
  name;

  static int<Name extends string>(
    name: Name,
    typeQualifiers?: TypeQualifier[]
  ) {
    return Par.new(Type.int(typeQualifiers), name);
  }

  static size_t<Name extends string>(
    name: Name,
    typeQualifiers?: TypeQualifier[]
  ) {
    return Par.new(Type.size_t(typeQualifiers), name);
  }

  /** Param for char*. */
  static string<Name extends string>(
    name: Name,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Par.new(Type.string(typeQualifiers, pointerQualifiers), name);
  }

  static float<Name extends string>(
    name: Name,
    typeQualifiers?: TypeQualifier[]
  ) {
    return Par.new(Type.float(typeQualifiers), name);
  }

  static double<Name extends string>(
    name: Name,
    typeQualifiers?: TypeQualifier[]
  ) {
    return Par.new(Type.double(typeQualifiers), name);
  }

  static new<S extends string, Name extends string>(
    type: TypeArg<S>,
    name: Name
  ) {
    return new Par(type, name);
  }
}
