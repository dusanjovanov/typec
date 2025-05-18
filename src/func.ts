import { BRANDING_MAP } from "./branding";
import type { Param } from "./param";
import { Val } from "./rValue";
import { Stat } from "./statement";
import { Type } from "./type";
import { type FuncArgsFromParams, type StatArg, type ValArg } from "./types";

/** Used for creating and using functions or just declaring and using their api if they come from C libraries. */
export class Func<
  Return extends string,
  const Params extends readonly Param<any, any>[],
  VarArgs extends boolean = false
> {
  constructor(
    returnType: Type<Return>,
    name: string,
    params: Params,
    body?: BodyFn<Params>,
    options?: FuncOptions<VarArgs>
  ) {
    this.returnType = returnType;
    this.name = name;
    this._params = params;
    this.body = body;
    this.hasVarArgs = options?.hasVarArgs as VarArgs extends void
      ? false
      : VarArgs;

    this.type = Type.func(returnType, this._params, this.hasVarArgs);

    const paramsByName: Record<string, any> = {};
    params.forEach((p) => {
      paramsByName[p.name] = p;
    });
    this.params = paramsByName as FuncParamsByName<Params>;
  }
  kind = BRANDING_MAP.func;
  returnType;
  name;
  /** Params by name */
  params;
  body;
  hasVarArgs;
  type;
  _params;

  /** Returns the address of this function. */
  ref() {
    return Val.ref(
      new Val({
        kind: "name",
        type: this.type,
        name: this.name,
      })
    );
  }

  /** Returns the declaration ( prototype ) statement for the function. */
  declare() {
    return Stat.funcDeclaration(this.type, this.name);
  }

  /**
   * Returns the definition ( implementation ) statement for the function.
   *
   * Returns a declaration statement if the body of the function is not defined.
   */
  define(): Stat {
    if (!this.body) return this.declare();

    return Stat.funcDef(
      this.type,
      this.name,
      this.body({ params: this.params })
    );
  }

  /** Returns this function's call expression Val. */
  call(...args: FuncArgs<Params, VarArgs>) {
    return Val.call(this, ...args);
  }

  toString() {
    return this.name;
  }

  /** Returns a return statement expression. */
  static return(value?: ValArg) {
    return Stat.return(value);
  }

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
    return new Func(Type.void(), name, params, body, options);
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
    return new Func(Type.bool(), name, params, body, options);
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
    return new Func(Type.int(), name, params, body, options);
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
    return new Func(Type.double(), name, params, body, options);
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
    return new Func(Type.string(), name, params, body, options);
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
    return new Func(returnType, name, params, body, options);
  }
}

type FuncOptions<VarArgs extends boolean> = {
  hasVarArgs?: VarArgs;
};

export type FuncArgs<
  Params extends readonly Param<any, any>[],
  VarArgs extends boolean
> = VarArgs extends false
  ? FuncArgsFromParams<Params>
  : [...FuncArgsFromParams<Params>, ...ValArg[]];

export type FuncParamsByName<Params extends readonly Param<any, any>[]> =
  Params extends []
    ? {}
    : Params extends readonly [
        infer First extends Param<any, any>,
        ...infer Rest extends Param<any, any>[]
      ]
    ? Rest extends readonly Param<any, any>[]
      ? Record<First["name"], First> & FuncParamsByName<Rest>
      : Record<First["name"], First>
    : {};

export type BodyFn<Params extends readonly Param<any, any>[]> = (arg: {
  params: FuncParamsByName<Params>;
}) => StatArg[];
