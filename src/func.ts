import { block } from "./chunk";
import { addressOf } from "./operators";
import { Type } from "./type";
import type {
  AutoPointerQualifier,
  AutoSpecifier,
  FuncParams,
  StringLike,
} from "./types";
import { emptyFalsy, joinArgs } from "./utils";

/** Used for creating functions or just declaring them if they come from other C libraries. */
export class Func {
  constructor(
    returnType: AutoSpecifier,
    name: string,
    params: FuncParams,
    body?: (fn: Func) => string[]
  ) {
    this.returnType = returnType;
    this.name = name;
    this.params = params;
    this.paramTypes = params.map((p) => p.type);
    this.type = Type.func(returnType, this.paramTypes);
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
  call(args?: StringLike[]) {
    return Func.call(this.name, args);
  }

  /** Returns a function call expression with support for var args. */
  callVarArgs(startArgs: StringLike[], varArgs: StringLike[]) {
    return Func.callVarArgs(this.name, startArgs, varArgs);
  }

  pointerType(qualifier?: AutoPointerQualifier, level = 1) {
    return Type.funcPointer(this.returnType, this.paramTypes, qualifier, level);
  }

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
}

export const func = (
  returnType: AutoSpecifier,
  name: string,
  params: FuncParams,
  body?: (fn: any) => string[]
) => {
  return new Func(returnType, name, params, body);
};

export class Param {
  constructor(type: AutoSpecifier, name: string) {
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
}

export const param = (type: AutoSpecifier, name: string) => {
  return new Param(type, name);
};

export class PointerParam extends Param {
  constructor(type: string, name: string) {
    super(type, name);
    this.type = type;
    this.name = name;
  }
  type;
  name;
}

export const pointerParam = (type: string, name: string) => {
  return new PointerParam(type, name);
};

export class VarArgsParam {
  type = "...";

  declare() {
    return this.type;
  }
}

export const varArgsParam = () => {
  return new VarArgsParam();
};
