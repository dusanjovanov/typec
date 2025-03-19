import { Func } from "../func";
import { Include } from "../include";
import { Param } from "../param";
import { Type } from "../type";

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

  static strncmp = Func.new(Type.int(), "strncmp", [
    Param.string("lhs", ["const"]),
    Param.string("rhs", ["const"]),
    Param.size_t("count"),
  ]);
}
