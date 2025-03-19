import { chunk } from "../chunk";
import { Include } from "../include";
import type { Type } from "../type";
import type { CodeLike } from "../types";
import { Value } from "../value";

export class VarArgs {
  constructor(argsName = "args") {
    this.argsName = argsName;
  }
  argsName;

  /** `va_list` */
  declare() {
    return `va_list ${this.argsName}`;
  }

  /**
   * `va_start`
   *
   * You have to pass the name of the last fixed param of the function.
   */
  start(nameOfLastFixedParam: CodeLike) {
    return `va_start(${this.argsName}, ${nameOfLastFixedParam})`;
  }

  /**
   * Initialize and start the var args stack.
   *
   * You have to pass the name of the last fixed param of the function.
   */
  declareAndStart(nameOfLastFixedParam: CodeLike) {
    return chunk([this.declare(), this.start(nameOfLastFixedParam)]);
  }

  /** Get the next arg. You have to pass it's type. */
  nextArg(type: Type) {
    return Value.new(`va_arg(${this.argsName}, ${type.str})`);
  }

  /** Cleanup - this has to be called when you're done reading the var args. */
  end() {
    return `va_end(${this.argsName})`;
  }

  static new(argsName?: string) {
    return new VarArgs(argsName);
  }
}

export class StdArg {
  static include() {
    return Include.system("stdarg.h");
  }

  /** Helper class for implementing a var arg function parameter. */
  static VarArgs = VarArgs;
}
