import { BRANDING_MAP } from "./brand";
import { Param } from "./param";
import type { Struct } from "./struct";
import type {
  GenericFuncs,
  GenericMembers,
  ParamClass,
  PointerQualifier,
  TcClassObj,
  TypeArg,
  TypeQualifier,
  VarClass,
} from "./types";
import { copyInstance, createMemberValues, setMulti } from "./utils";
import type { Val } from "./val";
import { Var } from "./variable";

/**
 * `tc` "class" api for c. Combines a struct with functions to create a class-like api.
 *
 * Accepts a struct and a dictionary of Func objects.
 *
 * Has helpers for creating variables and params that have a `_` field with struct field access Vals and "methods" ( bound functions ) on it.
 */
export class TcClass {
  static new<
    Name extends string,
    Members extends GenericMembers,
    const Methods extends GenericFuncs,
    Static extends GenericFuncs
  >(options: ClassOptions<Name, Members, Methods, Static>) {
    return createClass(options);
  }
}

const createClass = <
  StructName extends string,
  Members extends GenericMembers,
  const Methods extends GenericFuncs,
  Static extends GenericFuncs
>({
  struct,
  methods = {} as Methods,
  staticMethods: staticMethods = {} as Static,
  embed = [],
}: ClassOptions<StructName, Members, Methods, Static>) => {
  return {
    ...staticMethods,
    __static: staticMethods,
    kind: BRANDING_MAP.cls,
    struct,
    methods,
    embed,
    var(name: string, typeQualifiers?: TypeQualifier[]) {
      return createVarClass(
        this.struct.type(typeQualifiers),
        name,
        this.struct,
        this.methods
      );
    },
    pointer(
      name: string,
      typeQualifiers?: TypeQualifier[],
      pointerQualifiers?: PointerQualifier[]
    ) {
      return createVarClass<`${StructName}*`, Members, Methods>(
        this.struct.type(typeQualifiers).pointer(pointerQualifiers),
        name,
        this.struct as any,
        this.methods
      );
    },
    paramPointer<Name extends string>(
      name: Name,
      typeQualifiers?: TypeQualifier[],
      pointerQualifiers?: PointerQualifier[]
    ) {
      return createParamClass<`${StructName}*`, Members, Methods, Name>(
        this.struct.type(typeQualifiers).pointer(pointerQualifiers),
        name,
        this.struct as any,
        this.methods
      );
    },
  } as TcClassObj<StructName, Members, Methods, Static>;
};

type ClassOptions<
  Name extends string,
  Members extends GenericMembers,
  Methods extends GenericFuncs,
  Static extends GenericFuncs
> = {
  struct: Struct<Name, Members>;
  methods?: Methods;
  staticMethods?: Static;
  embed?: any[];
};

const createVarClass = <
  Name extends string,
  Members extends GenericMembers,
  const Methods extends GenericFuncs
>(
  type: TypeArg<Name>,
  name: string,
  struct: Struct<Name, Members>,
  methods: Methods
) => {
  const variable = new Var(type, name);

  const obj = copyInstance(variable);

  Object.assign(
    obj,
    createMemberValues(obj, struct),
    createBoundFuncs(obj, methods),
    {
      setMulti: setMulti(obj),
    }
  );

  return obj as VarClass<Name, Members, Methods>;
};

const createParamClass = <
  StructName extends string,
  Members extends GenericMembers,
  const Methods extends GenericFuncs,
  Name extends string
>(
  type: TypeArg<StructName>,
  name: Name,
  struct: Struct<StructName, Members>,
  methods: Methods
) => {
  const param = new Param(type, name);

  const obj = copyInstance(param);

  Object.assign(
    obj,
    createMemberValues(obj, struct),
    createBoundFuncs(obj, methods)
  );

  return obj as ParamClass<StructName, Members, Methods, Name>;
};

const createBoundFuncs = (exp: Val, funcs: GenericFuncs) => {
  const bound: Record<string, any> = {};
  Object.entries(funcs).forEach(([key, fn]) => {
    bound[key] = (...args: any[]) => {
      const firstParam = fn._params[0];

      let e = exp;

      if (
        firstParam.expType.typeKind === "pointer" &&
        exp.expType.typeKind !== "pointer"
      ) {
        e = exp.ref();
      }
      //
      else if (
        firstParam.expType.typeKind !== "pointer" &&
        exp.expType.typeKind === "pointer"
      ) {
        e = exp.deRef();
      }

      return fn(e, ...args);
    };
  });
  return bound;
};
