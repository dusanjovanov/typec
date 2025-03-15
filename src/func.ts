import { Address } from "./address";
import { block } from "./chunk";
import { Operator } from "./operators";
import { Pointer } from "./pointer";
import { Simple } from "./simple";
import {
  AnyType,
  type PassingValue,
  type PointerTypeQualifier,
  type TypeToValueContainer,
} from "./types";
import { emptyFalsy, joinArgs } from "./utils";
import { Var } from "./variable";

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
    body?: (fn: Func<Return, Params>) => string[],
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
    const bodyImpl = this.body?.(this) ?? [];

    return `${this.declare()}${block(bodyImpl)}`;
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
  pointer(name: string, pointerQualifiers?: PointerTypeQualifier[]) {
    return Var.new(this.type.pointer(pointerQualifiers), name);
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
    body?: (fn: any) => string[],
    varArgsParam?: VarArgsParam
  ) {
    return new Func(returnType, name, params, body, varArgsParam);
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
  pointer(pointerQualifiers?: PointerTypeQualifier[]) {
    return Pointer.new(this, pointerQualifiers);
  }

  static new<
    Return extends Simple | Pointer,
    const ParamTypes extends readonly (Simple | Pointer)[] = any,
    VarArgs extends VarArgsParam = any
  >(returnType: Return, paramTypes: ParamTypes, varArgsParam?: VarArgs) {
    return new FuncType(returnType, paramTypes, varArgsParam);
  }
}

export class Param<T extends Simple | Pointer = any> {
  constructor(type: T, name: string) {
    this.type = type;
    this.name = name;
  }
  type;
  name;

  address() {
    return this.type.toAddress(this.name) as Address<T>;
  }

  declare() {
    return `${this.type} ${this.name}`;
  }

  static new<T extends Simple | Pointer>(type: T, name: string) {
    return new Param(type, name);
  }
}

export class VarArgsParam {
  type = new AnyType("...");

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
  ? TypeToValueContainer<V>
  : never;

export type FuncParamTypes<Params extends readonly Param[]> = {
  [index in keyof Params]: Params[index]["type"];
};
