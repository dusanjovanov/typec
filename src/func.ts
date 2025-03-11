import { block } from "./chunk";
import { addressOf, assign } from "./operators";
import { pointer } from "./pointer";
import { Type } from "./type";
import type {
  AutoSpecifier,
  Func,
  FuncParams,
  FuncPointerParam,
  FuncValueParam,
  FuncVarArgsParam,
  StringLike,
} from "./types";
import { emptyFalsy, joinArgs, pointerStars } from "./utils";
import { variable } from "./variable";

/** Used for creating functions or just declaring them if they come from other C libraries. */
export const func = (
  returnType: AutoSpecifier,
  name: string,
  params: FuncParams,
  body?: (fn: any) => string[]
) => {
  const declaration = `${returnType} ${name}(${
    params.length > 0
      ? joinArgs(params.map((param) => `${param.declare()}`))
      : "void"
  })`;

  const paramTypes = params.map((p) => p.type);

  const funcAddr = addressOf(name);

  const fnName = name;

  const call = (args?: StringLike[]) => {
    return `${fnName}(${emptyFalsy(args, joinArgs)})`;
  };

  const fnObj: Func = {
    returnType,
    name,
    params,
    paramTypes,
    addr: () => funcAddr,
    /** Returns the declaration ( prototype ) of the function */
    declare: () => declaration,
    /** Returns the definition ( implementation ) of the function */
    define: () => {
      const bodyImpl = body?.({}) ?? [];

      return `${declaration}${block(bodyImpl)}`;
    },
    /** Returns a function call expression. */
    call,
    /** Returns a function call expression with support for var args. */
    callVarArgs: (startArgs: StringLike[], varArgs: StringLike[]) => {
      const args = [...startArgs];
      if (varArgs.length > 0) {
        args.push(...varArgs);
      }
      return call(args);
    },
    /** Returns a return statement expression. */
    return: (value: StringLike) => {
      return `return ${value};`;
    },
    /** Create a variable to be assigned the return value of the function */
    varReturn: (name: string) => {
      const varRet = variable(returnType, name);

      return {
        ...varRet,
        initReturn: (args?: StringLike[]) => {
          return assign(varRet.declare(), call(args));
        },
        assignReturn: (args?: StringLike[]) => {
          return assign(name, call(args));
        },
      };
    },
    /** Create a pointer to be assigned the return pointer of the function */
    pointerReturn: (name: string) => {
      const pointerRet = pointer(returnType, name);

      return {
        ...pointerRet,
        initReturn: (args?: StringLike[]) => {
          return assign(pointerRet.declare(), call(args));
        },
        assignReturn: (args?: StringLike[]) => {
          return assign(name, call(args));
        },
      };
    },
    /** Create a pointer to be assigned the address of the function */
    pointerFunc: (name: string) => {
      return {
        ...pointer(Type.funcPointer(returnType, paramTypes), name),
        declare: () => {
          return `${returnType} (${pointerStars()}${name})(${joinArgs(
            paramTypes
          )})`;
        },
        /** Initialize the pointer with the function address */
        initFuncAddr: () => {
          return assign(declaration, funcAddr);
        },
        /** Assign the function address to the pointer */
        assignFuncAddr: () => {
          return assign(name, funcAddr);
        },
      };
    },
  };

  return fnObj;
};

export const param = (type: AutoSpecifier, name: string): FuncValueParam => {
  return {
    kind: "param",
    type,
    name,
    addr: () => addressOf(name),
    declare: () => {
      return `${type} ${name}`;
    },
  };
};

export const pointerParam = (
  type: AutoSpecifier,
  name: string
): FuncPointerParam => {
  return {
    ...param(type, name),
    ...pointer(type, name),
    kind: "pointerParam",
  };
};

export const varArgsParam = (): FuncVarArgsParam => {
  return {
    kind: "varArgs",
    type: "...",
    declare: () => "...",
  };
};
