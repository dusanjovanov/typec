import { chunk } from "./chunk";
import { Func } from "./func";
import { Include } from "./include";
import { Param, VarArgsParam } from "./param";
import { Pointer } from "./pointer";
import { Simple } from "./simple";

export class VarArgsHelper {
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

export class StdIo {
  static include() {
    return Include.system("stdio.h");
  }

  static printf = Func.new(
    Simple.int(),
    "printf",
    [Param.string("_Format")],
    VarArgsParam.new()
  );

  static puts = Func.new(Simple.int(), "puts", [
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

  static malloc = Func.new(Pointer.void(), "malloc", [Param.size_t("_Size")]);

  static calloc = Func.new(Pointer.void(), "calloc", [
    Param.size_t("_Count"),
    Param.size_t("_Size"),
  ]);

  static realloc = Func.new(Pointer.void(), "realloc", [
    Param.new(Pointer.void(), "_Block"),
    Param.size_t("_Size"),
  ]);

  static free = Func.new(Simple.void(), "free", [
    Param.new(Pointer.void(), "_Block"),
  ]);
}

export class StdArg {
  static include() {
    return Include.system("stdarg.h");
  }

  /** Helper class for implementing a var arg function parameter. */
  static VarArgsHelper = VarArgsHelper;
}

export class StdString {
  include() {
    return Include.system("string.h");
  }

  static strlen = Func.new(Simple.size_t(), "strlen", [Param.string("str")]);

  static strnlen_s = Func.new(Simple.size_t(), "strnlen_s", [
    Param.string("str"),
    Param.size_t("strsz"),
  ]);

  static strcat = Func.new(Pointer.string(), "strcat", [
    Param.string("dest"),
    Param.string("src", ["const"]),
  ]);

  static strstr = Func.new(Pointer.string(), "strstr", [
    Param.string("str", ["const"]),
    Param.string("substr", ["const"]),
  ]);

  static strncpy = Func.new(Pointer.string(), "strncpy", [
    Param.string("dest", [], ["restrict"]),
    Param.string("src", [], ["restrict"]),
    Param.size_t("count"),
  ]);
}
