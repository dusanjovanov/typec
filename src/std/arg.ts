import { Chunk } from "../chunk";
import { MACRO_TYPE } from "../constants";
import { Directive } from "../directive";
import { Func } from "../func";
import { Type } from "../type";
import type { CodeLike } from "../types";

const va_list = Type.alias("va_list");

export const stdarg = {
  include: Directive.includeSystem("stdarg.h"),
  va_list,
  va_start: Func.void("va_start", [
    va_list.param("ap"),
    MACRO_TYPE.param("parmN"),
  ]),
  va_arg: Func.new(MACRO_TYPE, "va_arg", [
    va_list.param("ap"),
    MACRO_TYPE.param("T"),
  ]),
  va_end: Func.void("ap", [va_list.param("ap")]),
  va_copy: Func.void("va_copy", [va_list.param("dest"), va_list.param("src")]),
};

/**
 * Helper class for implementing a var arg function parameter.
 * Creates a `va_list` variable for you and binds all `va_` functions to that variable.
 */
export class VarArgs {
  constructor(argsName = "args") {
    this.args = va_list.var(argsName);
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
  nextArg(type: Type) {
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
