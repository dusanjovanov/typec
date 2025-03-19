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
