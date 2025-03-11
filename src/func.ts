import { block } from "./chunk";
import { addressOf, assign } from "./operators";
import { createPointer } from "./pointer";
import { Type } from "./type";
import type { AutoSpecifier, FuncParam, StringLike } from "./types";
import { emptyFalsy, fillArray, join } from "./utils";
import { createVar } from "./variable";

export const func = (
  returnType: AutoSpecifier,
  name: string,
  params: FuncParam[]
) => {
  const declaration = `${returnType} ${name}(${
    params.length > 0
      ? join(
          params.map((param) => `${param[0]} ${param[1]}`),
          ","
        )
      : "void"
  })`;

  const paramTypes = params.map((p) => p[0]);

  const pointerType = (level = 1) => {
    return Type.funcPointer(returnType, paramTypes, level);
  };

  const funcAddr = addressOf(name);

  const fnName = name;

  return {
    returnType,
    name,
    params,
    paramTypes,
    addr: () => funcAddr,
    declare: () => declaration,
    define: (body: string[]) => {
      return `${declaration}${block(body)}`;
    },
    call,
    var: (name: string) => {
      return {
        ...createVar(returnType, name),
        assignReturn: (args?: StringLike[]) => {
          return call(fnName, args);
        },
      };
    },
    pointer: (name: string) => {
      return {
        ...createPointer(pointerType(), name),
        declare: () => {
          return `${returnType} (${join(
            fillArray(1, () => "*")
          )}${name})(${join(paramTypes, ",")})`;
        },
        initFuncAddr: () => assign(declaration, funcAddr),
        assignFuncAddr: () => assign(name, funcAddr),
      };
    },
    pointerType,
  };
};

export const argsWithVarArgs = (
  startArgs: StringLike[],
  varArgs: StringLike[]
) => {
  const _args = [...startArgs];
  if (varArgs.length > 0) {
    _args.push(...varArgs);
  }
  return _args;
};

export const _return = (value: StringLike) => {
  return `return ${value};`;
};

export const call = (fnName: string, args?: StringLike[]) => {
  return `${fnName}(${emptyFalsy(args, (args) => args.join(","))})`;
};
