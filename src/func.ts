import { Address } from "./address";
import { block } from "./chunk";
import { Operator } from "./operators";
import type { Param, VarArgsParam } from "./param";
import { Pointer } from "./pointer";
import { Simple } from "./simple";
import {
  type PassingValue,
  type PointerQualifier,
  type TypeToValueContainer,
} from "./types";
import { emptyFalsy, joinArgs } from "./utils";
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
    this.params = params;
    this.paramTypes = params.map((p) => p.type);
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
    this.byName = paramsByName as FuncParamsByName<Params>;
  }
  type;
  returnType;
  name;
  params;
  /** Params by name */
  byName;
  paramTypes;
  body: PassingValue[] = [];
  varArgsParam;

  /** Add statements to the functions body. */
  add(statements: PassingValue[]) {
    this.body.push(...statements);
  }

  /** Returns the address of this function. */
  address() {
    return this.type.toAddress(Operator.addressOf(this.name));
  }

  /** Returns the declaration ( prototype ) of the function. */
  declare() {
    return `${this.returnType.specifier} ${this.name}(${
      this.params.length > 0
        ? joinArgs(this.params.map((param) => `${param.declare()}`))
        : "void"
    })`;
  }

  /** Returns the definition ( implementation ) of the function. */
  define() {
    return `${this.declare()}${block(this.body)}`;
  }

  private resolveReturn(value: string) {
    if (this.returnType instanceof Simple) {
      return this.returnType.toValue(value) as TypeToValueContainer<Return>;
    }
    //
    else {
      return this.returnType.toAddress(value) as TypeToValueContainer<Return>;
    }
  }

  /** Returns a function call expression. */
  call(args: FuncCallArgs<Params, VarArgs>) {
    return this.resolveReturn(Func.call(this.name, args as any));
  }

  /** Returns a function call expression with support for var args. */
  callVarArgs(startArgs: FuncArgsFromParams<Params>, varArgs: PassingValue[]) {
    return this.resolveReturn(
      Func.callVarArgs(this.name, startArgs as any, varArgs)
    );
  }

  return(value: TypeToValueContainer<Return>) {
    return value;
  }

  /** Returns a pointer variable meant to point to this function. */
  pointer(name: string, pointerQualifiers?: PointerQualifier[]) {
    return Variable.new(this.type.pointer(pointerQualifiers), name);
  }

  /** Returns a return statement expression. */
  static return(value: PassingValue) {
    return `return ${value};`;
  }

  /** Returns a function call expression. */
  static call(fnName: string, args?: PassingValue[]) {
    return `${fnName}(${emptyFalsy(args, joinArgs)})`;
  }

  /** Returns a function call expression with support for varargs. */
  static callVarArgs(
    fnName: string,
    startArgs: PassingValue[],
    varArgs: PassingValue[]
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
    this.specifier = `${this.returnType.specifier} (${joinArgs(
      this.paramTypes.map((p) => p.specifier)
    )}${emptyFalsy(varArgsParam, (v) => `,${v.type.specifier}`)})`;
  }
  returnType;
  paramTypes;
  specifier;

  toAddress(name: string) {
    return new Address(this, name);
  }

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

export type FuncCallArgs<
  Params extends readonly Param[],
  VarArgs extends VarArgsParam
> = VarArgs extends void
  ? FuncArgsFromParams<Params>
  : [...FuncArgsFromParams<Params>, ...PassingValue[]];

export type FuncArgsFromParams<Params extends readonly Param[]> = {
  [index in keyof Params]: FuncArgFromParam<Params[index]>;
};

export type FuncArgFromParam<T extends Param> = T extends Param<infer V>
  ? TypeToValueContainer<V>
  : never;

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
