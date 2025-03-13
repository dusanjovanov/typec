import { Address } from "./address";
import { chunk } from "./chunk";
import { Func, Param, VarArgsParam } from "./func";
import { Include } from "./include";
import { Pointer } from "./pointer";
import { Simple } from "./simple";

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
    malloc: Func.new(Pointer.type(Simple.type("void")), "malloc", [
      Param.new(Simple.type("size_t"), "_Size"),
    ]),
    calloc: Func.new(Pointer.type(Simple.type("void")), "calloc", [
      Param.new(Simple.type("size_t"), "_Count"),
      Param.new(Simple.type("size_t"), "_Size"),
    ]),
    realloc: Func.new(Pointer.type(Simple.type("void")), "realloc", [
      Param.new(Pointer.type(Simple.type("void")), "_Block"),
      Param.new(Simple.type("size_t"), "_Size"),
    ]),
    free: Func.new(Simple.type("void"), "free", [
      Param.new(Pointer.type(Simple.type("void")), "_Block"),
    ]),
  },
  arg: {
    include: () => Include.system("stdarg.h"),
    /** Helper for implementing a var arg function parameter. */
    varArgs: () => {
      const args = "args";

      return {
        /**
         * Initialize the var args stack.
         *
         * You have to pass the number of fixed params of the function ( i.e params before the var arg param )
         */
        init(fixedParamCount: number) {
          return chunk([
            `va_list ${args}`,
            `va_start(${args}, ${fixedParamCount})`,
          ]);
        },
        /** Get the next arg. You have to pass it's type.
         *
         * You should assign the returned string to a variable.
         */
        nextArg(type: Simple) {
          return `va_arg(${args}, ${type})`;
        },
        /** Cleanup - this has to be called when you're done reading the var args. */
        end() {
          return `va_end(${args})`;
        },
      };
    },
  },
};
