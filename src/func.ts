import { block } from "./chunk";
import { assign, ref, value } from "./operators";
import type { FuncParam, FuncParamType, FuncReturn, StringLike } from "./types";
import { emptyFalsy, fillArray, join } from "./utils";

export const _return = (value: StringLike) => `return ${value};`;

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

export const funcProto = (
  returnType: FuncReturn,
  name: string,
  params: FuncParam[]
) => {
  return `${returnType} ${name}(${
    params.length > 0
      ? params.map((param) => `${param[0]} ${param[1]}`)
      : "void"
  })`;
};

export const funcImpl = (
  returnType: FuncReturn,
  name: string,
  params: FuncParam[],
  body: string[]
) => {
  return `${funcProto(returnType, name, params)}${block(body)}`;
};

export const call = (name: string, args?: StringLike[]) => {
  return `${name}(${emptyFalsy(args, (args) => args.join(","))})`;
};

export const funcPointerType = (
  returnType: FuncReturn,
  paramTypes: FuncParamType[],
  level = 1
) =>
  `${returnType} (${join(fillArray(level, () => "*"))})(${join(
    paramTypes,
    ","
  )})`;

export const funcPointerDeclare = (
  returnType: FuncReturn,
  pointerName: string,
  paramTypes: FuncParamType[],
  level = 1
) => {
  return `${returnType} (${join(
    fillArray(level, () => "*")
  )}${pointerName})(${join(paramTypes, ",")})`;
};

export const funcPointerInit = (
  returnType: FuncReturn,
  pointerName: string,
  paramTypes: FuncParamType[],
  funcRef: string,
  level = 1
) => {
  return assign(
    funcPointerDeclare(returnType, pointerName, paramTypes, level),
    funcRef
  );
};

export const funcPointer = (
  returnType: FuncReturn,
  pointerName: string,
  paramTypes: FuncParamType[],
  level = 1
) => {
  return {
    declare: funcPointerDeclare(returnType, pointerName, paramTypes, level),
    init: (funcRef: string) => {
      return funcPointerInit(
        returnType,
        pointerName,
        paramTypes,
        funcRef,
        level
      );
    },
    name: pointerName,
    type: funcPointerType(returnType, paramTypes),
    value: value(pointerName),
    level,
  };
};

export const func = (
  returnType: FuncReturn,
  name: string,
  params: FuncParam[]
) => {
  return {
    proto: funcProto(returnType, name, params),
    impl: (body: string[]) => {
      return funcImpl(returnType, name, params, body);
    },
    call: (args?: StringLike[]) => {
      return call(name, args);
    },
    pointer: (pointerName: string) => {
      return funcPointer(
        returnType,
        pointerName,
        params.map((p) => p[0])
      );
    },
    name,
    returnType,
    params,
    ref: ref(name),
  };
};
