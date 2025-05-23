import { BRANDING_MAP } from "./brand";
import type { Param } from "./param";
import { Stat } from "./statement";
import { Type } from "./type";
import {
  type BodyFn,
  type FuncArgs,
  type FuncParamsByName,
  type ParamsListFromParams,
} from "./types";
import { Val } from "./val";

const createCallable = <
  Return extends string,
  const Params extends readonly Param<any, any>[],
  VarArgs extends boolean = false
>(
  returnType: Type<Return>,
  name: string,
  params: Params,
  body?: BodyFn<Params>,
  options?: FuncOptions<VarArgs>
) => {
  const obj = function (...args: any[]) {
    return Val.call(obj as any, ...args);
  };
  obj.kind = BRANDING_MAP.func;
  obj.returnType = returnType;
  Object.defineProperty(obj, "name", {
    value: name,
    writable: false,
    configurable: true,
  });
  obj._params = params;
  obj.body = body;
  obj.hasVarArgs = options?.hasVarArgs as VarArgs extends void
    ? false
    : VarArgs;

  obj.type = Type.func(returnType, params, obj.hasVarArgs);
  obj.declare = () => {
    return Stat.funcDeclaration(obj.type, name);
  };
  const paramsByName: Record<string, any> = {};
  params.forEach((p) => {
    paramsByName[p.name] = p;
  });
  obj.params = paramsByName as FuncParamsByName<Params>;
  obj.define = () => {
    if (!obj.body) return obj.declare();

    return Stat.funcDef(obj.type, name, obj.body({ params: obj.params }));
  };
  obj.val = () => {
    return new Val({
      kind: "name",
      type: obj.type,
      name: name,
    });
  };
  return obj as unknown as Func<Return, Params, VarArgs>;
};

/** Used for creating and using functions or just declaring and using their api if they come from C libraries. */
export class Fn {
  /** Shortcut for the `void` return type. */
  static void<
    const Params extends readonly Param<any, any>[],
    VarArgs extends boolean = false
  >(
    name: string,
    params: Params,
    body?: BodyFn<Params>,
    options?: FuncOptions<VarArgs>
  ) {
    return createCallable(Type.void(), name, params, body, options);
  }

  /** Shortcut for the `bool` return type. */
  static bool<
    const Params extends readonly Param<any, any>[],
    VarArgs extends boolean = false
  >(
    name: string,
    params: Params,
    body?: BodyFn<Params>,
    options?: FuncOptions<VarArgs>
  ) {
    return createCallable(Type.bool(), name, params, body, options);
  }

  /** Shortcut for the `int` return type. */
  static int<
    const Params extends readonly Param<any, any>[],
    VarArgs extends boolean = false
  >(
    name: string,
    params: Params,
    body?: BodyFn<Params>,
    options?: FuncOptions<VarArgs>
  ) {
    return createCallable(Type.int(), name, params, body, options);
  }

  /** Shortcut for the `double` return type. */
  static double<
    const Params extends readonly Param<any, any>[],
    VarArgs extends boolean = false
  >(
    name: string,
    params: Params,
    body?: BodyFn<Params>,
    options?: FuncOptions<VarArgs>
  ) {
    return createCallable(Type.double(), name, params, body, options);
  }

  /** Shortcut for the `char*` return type. */
  static string<
    const Params extends readonly Param<any, any>[],
    VarArgs extends boolean = false
  >(
    name: string,
    params: Params,
    body?: BodyFn<Params>,
    options?: FuncOptions<VarArgs>
  ) {
    return createCallable(Type.string(), name, params, body, options);
  }

  static new<
    Return extends string,
    const Params extends readonly Param<any, any>[],
    VarArgs extends boolean = false
  >(
    returnType: Type<Return>,
    name: string,
    params: Params,
    body?: BodyFn<Params>,
    options?: FuncOptions<VarArgs>
  ) {
    return createCallable(returnType, name, params, body, options);
  }
}

type FuncOptions<VarArgs extends boolean> = {
  hasVarArgs?: VarArgs;
};

export type Func<
  Return extends string,
  Params extends readonly Param<any, any>[],
  VarArgs extends boolean = false
> = {
  name: string;
  /** Returns the declaration ( prototype ) statement for the function. */
  declare(): Stat;
  /**
   * Returns the definition ( implementation ) statement for the function.
   *
   * If the body of the function is not defined, returns a declaration statement instead.
   */
  define(): Stat;
  /** Returns a Val for the name of this function. */
  val(): Val;
  hasVarArgs: boolean;
  _params: Params;
  returnType: Type<Return>;
  type: Type<`${Return}(${ParamsListFromParams<Params>})`>;
  body: BodyFn<Params> | undefined;
  params: FuncParamsByName<Params>;
} & ((...args: FuncArgs<Params, VarArgs>) => Val<Return>);
