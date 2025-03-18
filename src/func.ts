import { block } from "./chunk";
import { Operator } from "./operators";
import type { Param, VarArgsParam } from "./param";
import { Pointer } from "./pointer";
import { Simple } from "./simple";
import { type CodeLike, type PointerQualifier } from "./types";
import { emptyFalsy, joinArgs } from "./utils";
import { Value } from "./value";
import { Variable } from "./variable";

/** Used for creating functions or just declaring them if they come from other C libraries. */
export class Func<
  Return extends Simple | Pointer = any,
  const Params extends readonly Param[] = any,
  VarArgs extends VarArgsParam = any
> {
  constructor(
    returnType: Return,
    name: string,
    params: Params,
    varArgsParam?: VarArgs
  ) {
    this.returnType = returnType;
    this.name = name;
    this._params = params;
    this._paramTypes = params.map((p) => p.type);
    this.type = FuncType.new(
      returnType,
      params.map((p) => p.type),
      varArgsParam
    ) as FuncType<Return, FuncParamTypes<Params>, VarArgs>;
    this.varArgsParam = varArgsParam;

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
  varArgsParam;
  _params;
  _paramTypes;

  /** Add statements to the functions body. */
  add(...statements: CodeLike[]) {
    this.body.push(...statements);
  }

  /** Returns the address of this function. */
  ref() {
    return Value.new(this.type.pointer(), Operator.ref(this.name));
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

  /** Returns a function call expression. */
  call(args: FuncArgs<Params>) {
    return Value.new(this.returnType, Func.call(this.name, args as any));
  }

  /** Returns a function call expression with support for var args. */
  callVarArgs(startArgs: FuncArgs<Params>, varArgs: CodeLike[]) {
    return Value.new(
      this.returnType,
      Func.callVarArgs(this.name, startArgs as any, varArgs)
    );
  }

  return(value: CodeLike) {
    return value;
  }

  /** Returns a pointer variable meant to point to this function. */
  pointer(name: string, pointerQualifiers?: PointerQualifier[]) {
    return Variable.new(this.type.pointer(pointerQualifiers), name);
  }

  /** Returns a return statement expression. */
  static return(value: CodeLike) {
    return `return ${value};`;
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
    Return extends Simple | Pointer,
    const Params extends readonly Param[]
  >(
    returnType: Return,
    name: string,
    params: Params,
    varArgsParam?: VarArgsParam
  ) {
    return new Func(returnType, name, params, varArgsParam);
  }
}

export class FuncType<
  Return extends Simple | Pointer = any,
  const ParamTypes extends readonly (Simple | Pointer)[] = any,
  VarArgs extends VarArgsParam = any
> {
  constructor(
    returnType: Return,
    paramTypes: ParamTypes,
    varArgsParam?: VarArgs
  ) {
    this.returnType = returnType;
    this.paramTypes = paramTypes;
    this.full = `${this.returnType.full} (${joinArgs(
      this.paramTypes.map((p) => p.full)
    )}${emptyFalsy(varArgsParam, (v) => `,${v.type.specifier}`)})`;
  }
  kind = "func" as const;
  returnType;
  paramTypes;
  full;

  /** Create a pointer type for this function type. */
  pointer(pointerQualifiers?: PointerQualifier[]) {
    return Pointer.type(this, pointerQualifiers);
  }

  static new<
    Return extends Simple | Pointer,
    const ParamTypes extends readonly (Simple | Pointer)[] = any,
    VarArgs extends VarArgsParam = any
  >(returnType: Return, paramTypes: ParamTypes, varArgsParam?: VarArgs) {
    return new FuncType(returnType, paramTypes, varArgsParam);
  }
}

export type FuncArgs<Params extends readonly Param[]> = {
  [index in keyof Params]: CodeLike;
};

export type FuncParamTypes<Params extends readonly Param[]> = {
  [index in keyof Params]: Params[index]["type"];
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
