import { Block } from "./chunk";
import { Op } from "./operators";
import type { Par } from "./param";
import { Type } from "./type";
import {
  type CodeLike,
  type Embeddable,
  type FuncArgsFromParams,
} from "./types";

/** Used for creating and using functions or just declaring and using their api if they come from C libraries. */
export class Func<
  Return extends string,
  const Params extends readonly Par<any, any>[],
  VarArgs extends boolean = false
> implements Embeddable
{
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

    this.type = Type.func(
      returnType,
      this._params as unknown as Par<any, any>[],
      this.hasVarArgs
    );

    const paramsByName: Record<string, any> = {};
    params.forEach((p) => {
      paramsByName[p.name] = p;
    });
    this.params = paramsByName as FuncParamsByName<Params>;
  }
  kind = "func" as const;
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
    return Op.ref(this.type.ptr(), this.name);
  }

  /** Returns the declaration ( prototype ) of the function. */
  declare() {
    return this.type.declare(this.name);
  }

  /**
   * Returns the definition ( implementation ) of the function.
   *
   * Returns an empty string if the body function is not defined.
   */
  define() {
    if (!this.body) return "";

    return `${this.declare()}${Block.new(
      ...(this.body({ params: this.params }) ?? [])
    )}`;
  }

  embed() {
    return this.define();
  }

  /** Returns this function's call expression. */
  call(...args: FuncArgs<Params, VarArgs>) {
    return Op.call(this.name, args as any[]);
  }

  toString() {
    return this.name;
  }

  /** Returns a return statement expression. */
  static return(value?: CodeLike) {
    return Op.return(value);
  }

  /** Shortcut for the `void` return type. */
  static void<
    const Params extends readonly Par<any, any>[],
    VarArgs extends boolean = false
  >(
    name: string,
    params: Params,
    body?: (arg: { params: FuncParamsByName<Params> }) => CodeLike[],
    options?: FuncOptions<VarArgs>
  ) {
    return new Func(Type.void(), name, params, body, options);
  }

  /** Shortcut for the `bool` return type. */
  static bool<
    const Params extends readonly Par<any, any>[],
    VarArgs extends boolean = false
  >(
    name: string,
    params: Params,
    body?: (arg: { params: FuncParamsByName<Params> }) => CodeLike[],
    options?: FuncOptions<VarArgs>
  ) {
    return new Func(Type.bool(), name, params, body, options);
  }

  /** Shortcut for the `int` return type. */
  static int<
    const Params extends readonly Par<any, any>[],
    VarArgs extends boolean = false
  >(
    name: string,
    params: Params,
    body?: (arg: { params: FuncParamsByName<Params> }) => CodeLike[],
    options?: FuncOptions<VarArgs>
  ) {
    return new Func(Type.int(), name, params, body, options);
  }

  /** Shortcut for the `double` return type. */
  static double<
    const Params extends readonly Par<any, any>[],
    VarArgs extends boolean = false
  >(
    name: string,
    params: Params,
    body?: (arg: { params: FuncParamsByName<Params> }) => CodeLike[],
    options?: FuncOptions<VarArgs>
  ) {
    return new Func(Type.double(), name, params, body, options);
  }

  /** Shortcut for the `char*` return type. */
  static string<
    const Params extends readonly Par<any, any>[],
    VarArgs extends boolean = false
  >(
    name: string,
    params: Params,
    body?: (arg: { params: FuncParamsByName<Params> }) => CodeLike[],
    options?: FuncOptions<VarArgs>
  ) {
    return new Func(Type.string(), name, params, body, options);
  }

  static new<
    Return extends string,
    const Params extends readonly Par<any, any>[],
    VarArgs extends boolean = false
  >(
    returnType: Type<Return>,
    name: string,
    params: Params,
    body?: (arg: { params: FuncParamsByName<Params> }) => CodeLike[],
    options?: FuncOptions<VarArgs>
  ) {
    return new Func(returnType, name, params, body, options);
  }
}

type FuncOptions<VarArgs extends boolean> = {
  hasVarArgs?: VarArgs;
};

export type FuncArgs<
  Params extends readonly Par<any, any>[],
  VarArgs extends boolean
> = VarArgs extends false
  ? FuncArgsFromParams<Params>
  : [...FuncArgsFromParams<Params>, ...CodeLike[]];

export type FuncParamsByName<Params extends readonly Par<any, any>[]> =
  Params extends []
    ? {}
    : Params extends readonly [
        infer First extends Par<any, any>,
        ...infer Rest extends Par<any, any>[]
      ]
    ? Rest extends readonly Par<any, any>[]
      ? Record<First["name"], First> & FuncParamsByName<Rest>
      : Record<First["name"], First>
    : {};

export type BodyFn<Params extends readonly Par<any, any>[]> = (arg: {
  params: FuncParamsByName<Params>;
}) => CodeLike[];
