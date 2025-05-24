import { Fn, type Func } from "./func";
import { Stat } from "./statement";
import type { Struct } from "./struct";
import { Type } from "./type";
import {
  type BodyFn,
  type FuncArgs,
  type GenericMembers,
  type ParamsListFromParams,
  type ParamStruct,
  type ParamUnion,
  type PointerQualifier,
  type TypeArg,
  type TypeQualifier,
} from "./types";
import type { Union } from "./union";
import { copyInstance, createMemberValues } from "./utils";
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
    return createParamStruct<`${StructName}*`, Members, Name>(
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
    return createParamUnion<`${UnionName}*`, Members, Name>(
      union.type(typeQualifiers).pointer(pointerQualifiers),
      name,
      union as any
    );
  }

  static func<
    Return extends string,
    Name extends string,
    const Params extends readonly Param<any, any>[],
    VarArgs extends boolean = false
  >(
    returnType: Type<Return>,
    name: Name,
    params: Params,
    options?: {
      hasVarArgs?: VarArgs;
    }
  ) {
    return createFuncParam(returnType, params, name, options);
  }

  static new<S extends string, Name extends string>(
    type: TypeArg<S>,
    name: Name
  ) {
    return new Param(type, name);
  }
}

const createParamStruct = <
  StructName extends string,
  Members extends GenericMembers,
  Name extends string
>(
  type: TypeArg<StructName>,
  name: Name,
  struct: Struct<StructName, Members>
) => {
  const param = new Param(type, name);

  const obj = copyInstance(param);

  Object.assign(obj, createMemberValues(obj, struct));

  return obj as ParamStruct<StructName, Members, Name>;
};

const createParamUnion = <
  UnionName extends string,
  Members extends GenericMembers,
  Name extends string
>(
  type: TypeArg<UnionName>,
  name: Name,
  union: Union<UnionName, Members>
) => {
  const param = new Param(type, name);

  const obj = copyInstance(param);

  Object.assign(obj, createMemberValues(obj, union));

  return obj as ParamUnion<UnionName, Members, Name>;
};

const createFuncParam = <
  Return extends string,
  const Params extends readonly Param<any, any>[],
  Name extends string,
  VarArgs extends boolean = false
>(
  returnType: Type<Return>,
  params: Params,
  name: Name,
  options?: {
    hasVarArgs?: VarArgs;
  }
) => {
  const obj = (...args: any[]) => {
    return Val.call(obj as any, ...args);
  };
  Object.defineProperty(obj, "name", {
    value: name,
    writable: false,
    configurable: true,
  });
  obj.declare = () => {
    return Stat.paramDeclaration(
      Type.func(returnType, params, options?.hasVarArgs),
      name
    );
  };
  obj.duplicate = (name: string, body: BodyFn<Return, Params, VarArgs>) => {
    return Fn.new(returnType, name, params, body, options);
  };
  return obj as ParamFunc<Return, Params, Name, VarArgs>;
};

type ParamFunc<
  Return extends string,
  Params extends readonly Param<any, any>[],
  Name extends string,
  VarArgs extends boolean = false
> = Param<`${Return}(${ParamsListFromParams<Params>})`, Name> & {
  /** Returns a Func with the same signature ( type ) and a different name and body ( that you pass ). */
  duplicate: (
    name: string,
    body: BodyFn<Return, Params, VarArgs>
  ) => Func<Return, Params, VarArgs>;
} & ((...args: FuncArgs<Params, VarArgs>) => Val<Return>);
