import { block } from "./chunk";
import { assign, ref } from "./operators";
import { type PointerType, type VariableType } from "./type";
import type { FuncParam, StringLike } from "./types";
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

export const call = (name: string, args?: StringLike[]) => {
  return `${name}(${emptyFalsy(args, (args) => args.join(","))})`;
};

export class Func {
  constructor(
    returnType: VariableType | PointerType,
    name: string,
    params: FuncParam[]
  ) {
    this.returnType = returnType;
    this.name = name;
    this.params = params;
    this.declaration = `${this.returnType.full} ${this.name}(${
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
  declaration;
  ref;

  define(body: string[]) {
    return `${this.declaration}${block(body)}`;
  }

  call(args?: StringLike[]) {
    return call(this.name, args);
  }

  variable(name: string) {
    //
  }

  pointer(name: string) {
    return new FuncPointer(this, name);
  }
}

export class FunctVar {
  //
}

export class FuncPointer {
  constructor(func: Func, name: string, level = 1) {
    this.func = func;
    this.name = name;
    this.level = level;
    this.paramTypes = this.func.params.map((p) => p[0]);

    this.declaration = `${this.func.returnType.full} (${join(
      fillArray(this.level, () => "*")
    )}${this.name})(${join(this.paramTypes, ",")})`;

    this.type = `${this.func.returnType} (${join(
      fillArray(this.level, () => "*")
    )})(${join(this.paramTypes, ",")})`;

    this.init = assign(this.declaration, this.func.ref);
    this.assign = assign(this.name, this.func.ref);
  }
  func;
  name;
  level;
  paramTypes;
  declaration;
  type;
  init;
  assign;
}
