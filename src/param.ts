import { Stat } from "./statement";
import type { Struct } from "./struct";
import { Type } from "./type";
import {
  type GenericMembers,
  type PointerQualifier,
  type TypeArg,
  type TypeQualifier,
} from "./types";
import type { Union } from "./union";
import { createMemberValues } from "./utils";
import { Val } from "./val";

export class Param<S extends string, Name extends string> extends Val<S> {
  constructor(type: TypeArg<S>, name: Name) {
    super({
      kind: "name",
      type: Type.typeArgToType(type),
      name,
    });
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

  static structPointer<
    StructName extends string,
    Members extends GenericMembers,
    Name extends string
  >(
    struct: Struct<StructName, Members>,
    name: Name,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return new ParamStruct<`${StructName}*`, Members, Name>(
      struct.type(typeQualifiers).pointer(pointerQualifiers),
      name,
      struct as any
    );
  }

  static unionPointer<
    UnionName extends string,
    Members extends GenericMembers,
    Name extends string
  >(
    union: Union<UnionName, Members>,
    name: Name,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return new ParamUnion<`${UnionName}*`, Members, Name>(
      union.type(typeQualifiers).pointer(pointerQualifiers),
      name,
      union as any
    );
  }

  static new<S extends string, Name extends string>(
    type: TypeArg<S>,
    name: Name
  ) {
    return new Param(type, name);
  }
}

export class ParamStruct<
  StructName extends string,
  Members extends GenericMembers,
  Name extends string
> extends Param<StructName, Name> {
  constructor(
    type: TypeArg<StructName>,
    name: Name,
    struct: Struct<StructName, Members>
  ) {
    super(type, name);
    this.struct = struct;

    this._ = createMemberValues(this, struct);
  }
  struct;
  /** A typed dictionary of arrow/dot access ( arrow if pointer ) Val objects for each member. */
  _;
}

export class ParamUnion<
  UnionName extends string,
  Members extends GenericMembers,
  Name extends string
> extends Param<UnionName, Name> {
  constructor(
    type: TypeArg<UnionName>,
    name: Name,
    union: Union<UnionName, Members>
  ) {
    super(type, name);
    this.union = union;

    this._ = createMemberValues(this, union);
  }
  union;
  /** A typed dictionary of arrow/dot access ( arrow if pointer ) Val objects for each member. */
  _;
}
