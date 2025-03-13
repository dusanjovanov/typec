import { Address } from "./address";
import { block } from "./chunk";
import { Operator } from "./operators";
import type { PointerType } from "./pointer";
import { Simple } from "./simple";
import { AnyType, type PassingValue, type TypeToValue } from "./types";
import { emptyFalsy, joinArgs } from "./utils";

/** Used for creating functions or just declaring them if they come from other C libraries. */
export class Func<
  Return extends Simple | PointerType = any,
  const Params extends readonly Param[] = any,
  VarArgs extends VarArgsParam = any
> {
  constructor(
    returnType: Return,
    name: string,
    params: Params,
    body?: (fn: Func<Return, Params>) => string[],
    varArgsParam?: VarArgs
  ) {
    this.returnType = returnType;
    this.name = name;
    this.params = params;
    this.paramTypes = params.map((p) => p.type);
    this.type = Func.type(
      returnType,
      params.map((p) => p.type),
      varArgsParam
    ) as FuncType<Return, FuncParamTypes<Params>, VarArgs>;
    this.body = body;
    this.varArgsParam = varArgsParam;
  }
  type;
  returnType;
  name;
  params;
  paramTypes;
  body;
  varArgsParam;

  address() {
    return new Address(this.type, Operator.addressOf(this.name));
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
    const bodyImpl = this.body?.(this) ?? [];

    return `${this.declare()}${block(bodyImpl)}`;
  }

  /** Returns a function call expression. */
  call(args: FuncCallArgs<Params, VarArgs>) {
    return this.returnType.wrap(
      Func.call(this.name, args as any)
    ) as TypeToValue<Return>;
  }

  /** Returns a function call expression with support for var args. */
  callVarArgs(startArgs: FuncArgsFromParams<Params>, varArgs: PassingValue[]) {
    return this.returnType.wrap(
      Func.callVarArgs(this.name, startArgs as any, varArgs)
    ) as TypeToValue<Return>;
  }

  return(value: TypeToValue<Return>) {
    return value;
  }

  /** Returns a return statement expression. */
  static return(value: PassingValue) {
    return `return ${value};`;
  }

  static call(fnName: string, args?: PassingValue[]) {
    return `${fnName}(${emptyFalsy(args, joinArgs)})`;
  }

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
    Return extends Simple | PointerType,
    const Params extends readonly Param[]
  >(
    returnType: Return,
    name: string,
    params: Params,
    body?: (fn: any) => string[],
    varArgsParam?: VarArgsParam
  ) {
    return new Func(returnType, name, params, body, varArgsParam);
  }

  static type<
    Return extends Simple | PointerType,
    const ParamTypes extends readonly (Simple | PointerType)[] = any,
    VarArgs extends VarArgsParam = any
  >(returnType: Return, paramTypes: ParamTypes, varArgsParam?: VarArgs) {
    return new FuncType(returnType, paramTypes, varArgsParam);
  }
}

export class FuncType<
  Return extends Simple | PointerType = any,
  const ParamTypes extends readonly (Simple | PointerType)[] = any,
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
    )}${emptyFalsy(varArgsParam, (v) => `,${v.type.specifier}`)})` as const;
  }
  returnType;
  paramTypes;
  specifier;
}

export class Param<T extends Simple | PointerType = any> {
  constructor(type: T, name: string) {
    this.type = type;
    this.name = name;
  }
  type;
  name;

  address() {
    return new Address(
      this.type.specifier,
      Operator.addressOf(this.name)
    ) as Address<T["specifier"]>;
  }

  declare() {
    return `${this.type} ${this.name}`;
  }

  static new<T extends Simple | PointerType>(type: T, name: string) {
    return new Param(type, name);
  }
}

export class VarArgsParam {
  type = new AnyType("...");
  kind = "varargs" as const;

  declare() {
    return "...";
  }

  static new() {
    return new VarArgsParam();
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
  ? TypeToValue<V>
  : never;

export type FuncParamTypes<Params extends readonly Param[]> = {
  [index in keyof Params]: Params[index]["type"];
};
