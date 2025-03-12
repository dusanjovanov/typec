import { block } from "./chunk";
import { addressOf } from "./operators";
import type { Address, PointerType } from "./pointer";
import type { StringLike, TypeValue } from "./types";
import { emptyFalsy, joinArgs } from "./utils";
import { Value, VarType } from "./variable";

/** Used for creating functions or just declaring them if they come from other C libraries. */
export class Func<
  Return extends VarType | PointerType,
  const Params extends readonly (Param | VarArgsParam)[] = []
> {
  constructor(
    returnType: Return,
    name: string,
    params: Params,
    body?: (fn: Func<Return, Params>) => string[]
  ) {
    this.returnType = returnType;
    this.name = name;
    this.params = params;
    this.paramTypes = params.map((p) => p.type);
    this.type = Func.type(returnType, params as any);
    this.body = body;
  }
  type;
  returnType;
  name;
  params;
  paramTypes;
  body;

  addr() {
    return addressOf(this.name);
  }

  /** Returns the declaration ( prototype ) of the function. */
  declare() {
    return `${this.returnType} ${this.name}(${
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
  call(args: FuncArgsFromParams<Params>) {
    return this.returnType.wrap(
      Func.call(this.name, args as any)
    ) as TypeValue<Return>;
  }

  /** Returns a function call expression with support for var args. */
  callVarArgs(startArgs: StringLike[], varArgs: StringLike[]) {
    return Func.callVarArgs(this.name, startArgs, varArgs);
  }

  // pointerType(qualifier?: AutoPointerQualifier, level = 1) {
  //   // return Type.funcPointer(this.returnType, this.paramTypes, qualifier, level);
  // }

  /** Returns a return statement expression. */
  static return(value: StringLike) {
    return `return ${value};`;
  }

  static call(fnName: string, args?: StringLike[]) {
    return `${fnName}(${emptyFalsy(args, joinArgs)})`;
  }

  static callVarArgs(
    fnName: string,
    startArgs: StringLike[],
    varArgs: StringLike[]
  ) {
    const args = [...startArgs];
    if (varArgs.length > 0) {
      args.push(...varArgs);
    }
    return Func.call(fnName, args);
  }

  static new<
    Return extends VarType | PointerType,
    const Params extends readonly (Param | VarArgsParam)[]
  >(
    returnType: Return,
    name: string,
    params: Params,
    body?: (fn: any) => string[]
  ) {
    return new Func(returnType, name, params, body);
  }

  static type<
    Return extends VarType | PointerType,
    Params extends readonly (Param | VarArgsParam)[] = []
  >(returnType: Return, params: Params) {
    return new FuncType(returnType, params);
  }
}

export class FuncType<
  Return extends VarType | PointerType = any,
  Params extends readonly (Param | VarArgsParam)[] = []
> {
  constructor(returnType: Return, params: Params) {
    this.returnType = returnType;
    this.params = params;
  }
  returnType;
  params;

  declare() {
    return `${this.returnType.specifier} (${joinArgs(
      this.params.map((p) => p.type.specifier)
    )})`;
  }
}

export class Param<T extends VarType | PointerType = any> {
  constructor(type: T, name: string) {
    this.type = type;
    this.name = name;
  }
  type;
  name;

  addr() {
    return addressOf(this.name);
  }

  declare() {
    return `${this.type} ${this.name}`;
  }

  static new<T extends VarType | PointerType>(type: T, name: string) {
    return new Param(type, name);
  }
}

export class VarArgsParam {
  type = "...";
  kind = "varargs" as const;

  declare() {
    return this.type;
  }

  static new() {
    return new VarArgsParam();
  }
}

export type FuncArgsFromParams<
  Params extends readonly (Param | VarArgsParam)[]
> = { [index in keyof Params]?: FuncArgFromParam<Params[index]> };

export type FuncArgFromParam<T extends Param | VarArgsParam> = T extends Param<
  infer V
>
  ? TypeValue<V>
  : T extends VarArgsParam
  ? Value<any> | Address<any>
  : never;
