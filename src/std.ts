import { Address } from "./address";
import { chunk } from "./chunk";
import { Func, Param, VarArgsParam } from "./func";
import { Include } from "./include";
import { Pointer } from "./pointer";
import { Simple } from "./simple";

class VarArgsHelper {
  constructor(argsName = "varargs") {
    this.argsName = argsName;
  }
  argsName;

  /**
   * Initialize the var args stack.
   *
   * You have to pass the number of fixed params of the function ( i.e params before the var arg param )
   */
  init(fixedParamCount: number) {
    return chunk([
      `va_list ${this.argsName}`,
      `va_start(${this.argsName}, ${fixedParamCount})`,
    ]);
  }

  /** Get the next arg. You have to pass it's type.
   *
   * You should assign the returned string to a variable.
   */
  nextArg(type: Simple) {
    return `va_arg(${this.argsName}, ${type.specifier})`;
  }

  /** Cleanup - this has to be called when you're done reading the var args. */
  end() {
    return `va_end(${this.argsName})`;
  }

  static new(argsName?: string) {
    return new VarArgsHelper(argsName);
  }
}

const printfFn = Func.new(
  Simple.type("int"),
  "printf",
  [Param.new(Pointer.type(Simple.type("char")), "_Format")],
  undefined,
  VarArgsParam.new()
);

/** Functions and helpers for standard C libraries */
export const std = {
  printf: (format: string, ...args: any[]) => {
    return printfFn.callVarArgs([Address.string(format)], args);
  },
  io: {
    include: () => Include.system("stdio.h"),
    printf: printfFn,
  },
  lib: {
    include: () => Include.system("stdlib.h"),
    includeCpp: () => Include.system("cstdlib.h"),
    malloc: Func.new(Pointer.simple("void"), "malloc", [
      Param.new(Simple.type("size_t"), "_Size"),
    ]),
    calloc: Func.new(Pointer.simple("void"), "calloc", [
      Param.new(Simple.type("size_t"), "_Count"),
      Param.new(Simple.type("size_t"), "_Size"),
    ]),
    realloc: Func.new(Pointer.simple("void"), "realloc", [
      Param.new(Pointer.simple("void"), "_Block"),
      Param.new(Simple.type("size_t"), "_Size"),
    ]),
    free: Func.new(Simple.type("void"), "free", [
      Param.new(Pointer.simple("void"), "_Block"),
    ]),
  },
  arg: {
    include: () => Include.system("stdarg.h"),
    /** Helper class for implementing a var arg function parameter. */
    VarArgsHelper,
  },
};
