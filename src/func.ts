import { Block } from "./chunk";
import { Operator } from "./operators";
import type { Param } from "./param";
import { Type } from "./type";
import { type CodeLike } from "./types";
import { emptyFalsy, joinArgs } from "./utils";
import { Value } from "./value";

/** Used for creating and using functions or just declaring and using their api if they come from C libraries. */
export class Func<
  const Params extends readonly Param[] = any,
  VarArgs extends boolean = false
> {
  constructor(
    returnType: Type,
    name: string,
    params: Params,
    body?: (arg: { params: FuncParamsByName<Params> }) => CodeLike[],
    options?: FuncOptions<VarArgs>
  ) {
    this.returnType = returnType;
    this.name = name;
    this._params = params;
    this._paramTypes = params.map((p) => p.type);
    this.type = Type.func(returnType, this._paramTypes);
    this.body = body;
    this.hasVarArgs = options?.hasVarArgs;

    const paramsByName: Record<string, any> = {};
    params.forEach((p) => {
      paramsByName[p.name] = p;
    });
    this.params = paramsByName as FuncParamsByName<Params>;
  }
  type;
  returnType;
  name;
  /** Params by name */
  params;
  body;
  hasVarArgs;
  _params;
  _paramTypes;
  _subs = new Set<FuncSubscriber<this>>();

  /** Returns the address of this function. */
  ref() {
    return Value.new(Operator.ref(this.name));
  }

  /** Returns the declaration ( prototype ) of the function. */
  declare() {
    return `${this.returnType.str} ${this.name}(${
      this._params.length > 0
        ? joinArgs(this._params.map((param) => `${param.declare()}`))
        : "void"
    })`;
  }

  /**
   * Returns the definition ( implementation ) of the function.
   *
   * Returns an empty string if the body function is not defined.
   */
  define() {
    if (!this.body) return "";

    return `${this.declare()}${Block.new(
      this.body({ params: this.params }) ?? []
    )}`;
  }

  /** Returns this function's call expression. */
  call(...args: FuncArgs<Params, VarArgs>) {
    this._subs.forEach((s) => s(this));
    const _args = args.slice(0, this._params.length);
    if (this.hasVarArgs) {
      _args.push(...args.slice(this._params.length));
    }
    return Value.new(Func.call(this.name, _args as any));
  }

  /** Subscribe to `.call()` calls. */
  onCall(cb: FuncSubscriber<this>) {
    this._subs.add(cb);
    return () => {
      this._subs.delete(cb);
    };
  }

  /** Returns a return statement expression. */
  static return(value: CodeLike) {
    return `return ${value}`;
  }

  /** Returns a function call expression. */
  static call(fnName: string, args: CodeLike[]) {
    return `${fnName}(${emptyFalsy(args, joinArgs)})`;
  }

  /** Returns a function call expression with support for varargs. */
  static callVarArgs(
    fnName: string,
    startArgs: CodeLike[],
    varArgs: CodeLike[]
  ) {
    const args = [...startArgs];
    if (varArgs.length > 0) {
      args.push(...varArgs);
    }
    return Func.call(fnName, args);
  }

  static new<
    Return extends Type,
    const Params extends readonly Param[],
    VarArgs extends boolean = false
  >(
    returnType: Return,
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
  Params extends readonly Param[],
  VarArgs extends boolean
> = VarArgs extends false
  ? FuncArgsFromParams<Params>
  : [...FuncArgsFromParams<Params>, ...CodeLike[]];

type FuncArgsFromParams<Params extends readonly Param[]> = {
  [index in keyof Params]: CodeLike;
};

export type FuncParamsByName<Params extends readonly Param[]> =
  Params extends []
    ? {}
    : Params extends readonly [
        infer First extends Param,
        ...infer Rest extends Param[]
      ]
    ? Rest extends readonly Param[]
      ? Record<First["name"], First> & FuncParamsByName<Rest>
      : Record<First["name"], First>
    : {};

type FuncSubscriber<T extends Func<any, any>> = (func: T) => void;
