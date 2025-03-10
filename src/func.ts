import { block } from "./chunk";
import { assign, ref } from "./operators";
import { createPointer } from "./pointer";
import type { AutoSpecifier, FuncParam, StringLike } from "./types";
import { emptyFalsy, fillArray, join } from "./utils";
import { createVar } from "./variable";

export class Func {
  constructor(returnType: AutoSpecifier, name: string, params: FuncParam[]) {
    this.returnType = returnType;
    this.name = name;
    this.params = params;
    this.paramTypes = params.map((p) => p[0]);
    this.declaration = `${this.returnType} ${this.name}(${
      this.params.length > 0
        ? join(
            this.params.map((param) => `${param[0]} ${param[1]}`),
            ","
          )
        : "void"
    })`;
    this.ref = ref(this.name);
  }
  returnType;
  name;
  params;
  paramTypes;
  declaration;
  ref;

  define(body: string[]) {
    return `${this.declaration}${block(body)}`;
  }

  call(args?: StringLike[]) {
    return `${this.name}(${emptyFalsy(args, (args) => args.join(","))})`;
  }

  variable(name: string) {
    return {
      ...createVar(this.returnType, name),
      assignReturn: (args?: StringLike[]) => {
        return this.call(args);
      },
    };
  }

  pointer(name: string) {
    return {
      ...createPointer(this.pointerType(), name),
      declaration: `${this.returnType} (${join(fillArray(1, () => "*"))}${
        this.name
      })(${join(this.paramTypes, ",")})`,
      init: assign(this.declaration, this.ref),
      assignFunc: assign(this.name, this.ref),
    };
  }

  pointerType(level = 1) {
    return `${this.returnType} (${join(fillArray(level, () => "*"))})(${join(
      this.paramTypes,
      ","
    )})`;
  }

  static return(value: StringLike) {
    return `return ${value};`;
  }
}

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
