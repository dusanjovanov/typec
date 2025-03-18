import { chunk } from "./chunk";
import { Func } from "./func";
import { Include } from "./include";
import { Param } from "./param";
import { Type } from "./type";
import type { CodeLike } from "./types";
import { Value } from "./value";

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

  /** Get the next arg. You have to pass it's type.
   *
   * You should assign the returned string to a variable.
   */
  nextArg(type: Type) {
    return Value.new(`va_arg(${this.argsName}, ${type.full})`);
  }

  /** Cleanup - this has to be called when you're done reading the var args. */
  end() {
    return `va_end(${this.argsName})`;
  }

  static new(argsName?: string) {
    return new VarArgs(argsName);
  }
}

export class StdIo {
  static include() {
    return Include.system("stdio.h");
  }

  static printf = Func.new(
    Type.int(),
    "printf",
    [Param.string("_Format")],
    true
  );

  static puts = Func.new(Type.int(), "puts", [
    Param.string("_Buffer", ["const"]),
  ]);
}

export class StdLib {
  static include() {
    return Include.system("stdlib.h");
  }

  static includeCpp() {
    return Include.system("cstdlib.h");
  }

  static malloc = Func.new(Type.ptrVoid(), "malloc", [Param.size_t("_Size")]);

  static calloc = Func.new(Type.ptrVoid(), "calloc", [
    Param.size_t("_Count"),
    Param.size_t("_Size"),
  ]);

  static realloc = Func.new(Type.ptrVoid(), "realloc", [
    Param.new(Type.ptrVoid(), "_Block"),
    Param.size_t("_Size"),
  ]);

  static free = Func.new(Type.void(), "free", [
    Param.new(Type.ptrVoid(), "_Block"),
  ]);
}

export class StdArg {
  static include() {
    return Include.system("stdarg.h");
  }

  /** Helper class for implementing a var arg function parameter. */
  static VarArgs = VarArgs;
}

export class StdString {
  include() {
    return Include.system("string.h");
  }

  static strlen = Func.new(Type.size_t(), "strlen", [Param.string("str")]);

  static strnlen_s = Func.new(Type.size_t(), "strnlen_s", [
    Param.string("str"),
    Param.size_t("strsz"),
  ]);

  static strcat = Func.new(Type.string(), "strcat", [
    Param.string("dest"),
    Param.string("src", ["const"]),
  ]);

  static strstr = Func.new(Type.string(), "strstr", [
    Param.string("str", ["const"]),
    Param.string("substr", ["const"]),
  ]);

  static strcpy = Func.new(Type.string(), "strcpy", [
    Param.string("dest", [], ["restrict"]),
    Param.string("src", [], ["restrict"]),
  ]);

  static strncpy = Func.new(Type.string(), "strncpy", [
    Param.string("dest", [], ["restrict"]),
    Param.string("src", [], ["restrict"]),
    Param.size_t("count"),
  ]);
}
