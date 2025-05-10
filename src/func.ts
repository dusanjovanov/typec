import { Block } from "./chunk";
import { Operator } from "./operators";
import type { Param } from "./param";
import { Type } from "./type";
import { type CodeLike } from "./types";
import { joinArgs } from "./utils";

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
    return Operator.ref(this.name);
  }

  /** Returns the declaration ( prototype ) of the function. */
  declare() {
    const retStr = this.returnType.str;

    if (this._params.length === 0) {
      return `${retStr} ${this.name}(void)`;
    }
    //
    else {
      return `${retStr} ${this.name}(${joinArgs(
        this._params.map((p) => `${p.type} ${p.name}`)
      )}${emptyFalsy(this.hasVarArgs, () => `,...`)})`;
    }
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
    this._subs.forEach((s) => s(this));
    const _args = args.slice(0, this._params.length);
    if (this.hasVarArgs) {
      _args.push(...args.slice(this._params.length));
    }
    return Operator.call(this.name, _args as any);
  }

  toString() {
    return this.name;
  }

  /** Returns a return statement expression. */
  static return(value?: CodeLike) {
    return Operator.return(value);
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
    return Operator.call(fnName, args);
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

const emptyFalsy = <T>(
  value: T | null | undefined | boolean,
  format?: (str: T) => string
) => {
  const isEmpty =
    value == null ||
    value === false ||
    (Array.isArray(value) && value.length === 0) ||
    value === "";

  if (isEmpty) return "";

  return format ? format(value as T) : String(value);
};
