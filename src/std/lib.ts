import { Func } from "../func";
import { Include } from "../include";
import { Param } from "../param";
import { Type } from "../type";

export class StdLib {
  static include() {
    return Include.system("stdlib.h");
  }

  static includeCpp() {
    return Include.system("cstdlib.h");
  }

  static malloc = Func.new(Type.pointerVoid(), "malloc", [Param.size_t("_Size")]);

  static calloc = Func.new(Type.pointerVoid(), "calloc", [
    Param.size_t("_Count"),
    Param.size_t("_Size"),
  ]);

  static realloc = Func.new(Type.pointerVoid(), "realloc", [
    Param.new(Type.pointerVoid(), "_Block"),
    Param.size_t("_Size"),
  ]);

  static free = Func.new(Type.void(), "free", [
    Param.new(Type.pointerVoid(), "_Block"),
  ]);
}
