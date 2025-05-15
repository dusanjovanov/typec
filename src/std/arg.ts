import { Chunk } from "../chunk";
import { MACRO_TYPE } from "../constants";
import { Dir } from "../directive";
import { Func } from "../func";
import { Par } from "../param";
import { Type } from "../type";
import type { CodeLike } from "../types";
import { Var } from "../variable";

const va_list = Type.alias("va_list");

export const stdarg = {
  include: Dir.includeSystem("stdarg.h"),
  va_list,
  va_start: Func.void("va_start", [
    Par.new(va_list, "ap"),
    Par.new(MACRO_TYPE, "parmN"),
  ]),
  va_arg: Func.new(MACRO_TYPE, "va_arg", [
    Par.new(va_list, "ap"),
    Par.new(MACRO_TYPE, "T"),
  ]),
  va_end: Func.void("ap", [Par.new(va_list, "ap")]),
  va_copy: Func.void("va_copy", [
    Par.new(va_list, "dest"),
    Par.new(va_list, "src"),
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
  start(nameOfLastFixedParam: CodeLike) {
    return stdarg.va_start.call(this.args, nameOfLastFixedParam);
  }

  /**
   * Initialize and start the var args stack.
   *
   * You have to pass the name of the last fixed param of the function.
   */
  declareAndStart(nameOfLastFixedParam: CodeLike) {
    return Chunk.new(this.declare(), this.start(nameOfLastFixedParam));
  }

  /** Get the next arg. You have to pass it's type. */
  nextArg(type: Type<any>) {
    return stdarg.va_arg.call(this.args, type);
  }

  /** Cleanup - this has to be called when you're done reading the var args. */
  end() {
    return stdarg.va_end.call(this.args);
  }

  static new(argsName?: string) {
    return new VarArgs(argsName);
  }
}
