import { MACRO_TYPE } from "../constants";
import { Dir } from "../directive";
import { Fn } from "../func";
import { Param } from "../param";
import { Stat } from "../statement";
import { Type } from "../type";
import type { ValArg } from "../types";
import { Var } from "../variable";

const va_list = Type.alias("va_list");

export const stdarg = {
  include: Dir.includeSys("stdarg.h"),
  va_list,
  va_start: Fn.void("va_start", [
    Param.new(va_list, "ap"),
    Param.new(MACRO_TYPE, "parmN"),
  ]),
  va_arg: Fn.new(MACRO_TYPE, "va_arg", [
    Param.new(va_list, "ap"),
    Param.new(MACRO_TYPE, "T"),
  ]),
  va_end: Fn.void("ap", [Param.new(va_list, "ap")]),
  va_copy: Fn.void("va_copy", [
    Param.new(va_list, "dest"),
    Param.new(va_list, "src"),
  ]),
};

/**
 * Helper class for implementing a var arg function parameter.
 * Creates a `va_list` variable for you and binds all `va_` functions to that variable.
 */
export class VarArgs {
  constructor(argsName = "args") {
    this.args = Var.new(va_list, argsName);
  }
  args;

  /** Declare the `va_list` */
  declare() {
    return this.args.declare();
  }

  /**
   * `va_start`
   *
   * You have to pass the name of the last fixed param of the function.
   */
  start(nameOfLastFixedParam: ValArg) {
    return stdarg.va_start(this.args, nameOfLastFixedParam);
  }

  /**
   * Initialize and start the var args stack.
   *
   * You have to pass the name of the last fixed param of the function.
   */
  declareAndStart(nameOfLastFixedParam: ValArg) {
    return Stat.chunk([this.declare(), this.start(nameOfLastFixedParam)]);
  }

  /** Get the next arg. You have to pass it's type. */
  nextArg(type: Type) {
    return stdarg.va_arg(this.args, type);
  }

  /** Cleanup - this has to be called when you're done reading the var args. */
  end() {
    return stdarg.va_end(this.args);
  }

  static new(argsName?: string) {
    return new VarArgs(argsName);
  }
}
