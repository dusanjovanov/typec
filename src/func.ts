import { block } from "./chunk";
import { Operator } from "./operators";
import type { Param } from "./param";
import { Type } from "./type";
import { type CodeLike } from "./types";
import { emptyFalsy, joinArgs } from "./utils";
import { Value } from "./value";

/** Used for creating functions or just declaring them if they come from other C libraries. */
export class Func<
  const Params extends readonly Param[] = any,
  VarArgs extends boolean = false
> {
  constructor(
    returnType: Type,
    name: string,
    params: Params,
    hasVarArgs?: VarArgs
  ) {
    this.returnType = returnType;
    this.name = name;
    this._params = params;
    this._paramTypes = params.map((p) => p.type);
    this.type = Type.func(returnType, this._paramTypes);
    this.hasVarArgs = hasVarArgs;

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
  body: CodeLike[] = [];
  hasVarArgs;
  _params;
  _paramTypes;

  /** Add statements to the functions body. */
  add(...statements: CodeLike[]) {
    this.body.push(...statements);
  }

  /** Returns the address of this function. */
  ref() {
    return Value.new(Operator.ref(this.name));
  }

  /** Returns the declaration ( prototype ) of the function. */
  declare() {
    return `${this.returnType.full} ${this.name}(${
      this._params.length > 0
        ? joinArgs(this._params.map((param) => `${param.declare()}`))
        : "void"
    })`;
  }

  /** Returns the definition ( implementation ) of the function. */
  define() {
    return `${this.declare()}${block(this.body)}`;
  }

  /** Returns this function's call expression. */
  call(...args: FuncArgs<Params, VarArgs>) {
    const _args = args.slice(0, this._params.length);
    if (this.hasVarArgs) {
      _args.push(...args.slice(this._params.length));
    }
    return Value.new(Func.call(this.name, _args as any));
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
  >(returnType: Return, name: string, params: Params, varArgsParam?: VarArgs) {
    return new Func(returnType, name, params, varArgsParam);
  }
}

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
    : "test";
