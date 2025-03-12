import { chunk } from "./chunk";
import { Func, Param, VarArgsParam } from "./func";
import { includeSys } from "./include";
import { Address, Pointer } from "./pointer";
import { Var, VarType } from "./variable";

export const std = {
  io: {
    include: () => includeSys("stdio.h"),
    printf: Func.new(Var.type("int"), "printf", [
      Param.new(Pointer.type("char"), "_Format"),
      VarArgsParam.new(),
    ]),
  },
  lib: {
    include: () => includeSys("stdlib.h"),
    includeCpp: () => includeSys("cstdlib.h"),
    malloc: Func.new(Pointer.type("void"), "malloc", [
      Param.new(Var.type("size_t"), "_Size"),
    ]),
    calloc: Func.new(Pointer.type("void"), "calloc", [
      Param.new(Var.type("size_t"), "_Count"),
      Param.new(Var.type("size_t"), "_Size"),
    ]),
    realloc: Func.new(Pointer.type("void"), "realloc", [
      Param.new(Pointer.type("void"), "_Block"),
      Param.new(Var.type("size_t"), "_Size"),
    ]),
    free: Func.new(Var.type("void"), "free", [
      Param.new(Pointer.type("void"), "_Block"),
    ]),
  },
  arg: {
    include: () => includeSys("stdarg.h"),
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
        nextArg(type: VarType) {
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

std.io.printf.call([new Address("char", "asdasd")]);

Func.new(Var.type("void"), "asd", []).call([]);
