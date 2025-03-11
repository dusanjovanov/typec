import { chunk } from "./chunk";
import { func, param, varArgsParam } from "./func";
import { includeSys } from "./include";
import { Type } from "./type";
import type { AutoSpecifier } from "./types";

export const std = {
  io: {
    include: () => includeSys("stdio.h"),
    printf: func(Type.var("int"), "printf", [
      param(Type.constPointer(Type.const("char")), "_Format"),
      varArgsParam(),
    ]),
  },
  lib: {
    include: () => includeSys("stdlib.h"),
    includeCpp: () => includeSys("cstdlib.h"),
    malloc: func(Type.pointer("void"), "malloc", [param("size_t", "_Size")]),
    calloc: func(Type.pointer("void"), "calloc", [
      param("size_t", "_Count"),
      param("size_t", "_Size"),
    ]),
    realloc: func(Type.pointer("void"), "realloc", [
      param(Type.pointer("void"), "_Block"),
      param("size_t", "_Size"),
    ]),
    free: func("void", "free", [param(Type.pointer("void"), "_Block")]),
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
        nextArg(type: AutoSpecifier) {
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
