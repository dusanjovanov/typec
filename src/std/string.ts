import { Directive } from "../directive";
import { Func } from "../func";
import { Param } from "../param";
import { Type } from "../type";

export const stdstring = {
  include: Directive.includeSystem("string.h"),
  strlen: Func.new(Type.size_t(), "strlen", [Param.string("str")]),
  strnlen_s: Func.new(Type.size_t(), "strnlen_s", [
    Param.string("str"),
    Param.size_t("strsz"),
  ]),
  strcat: Func.string("strcat", [
    Param.string("dest"),
    Param.string("src", ["const"]),
  ]),
  strstr: Func.string("strstr", [
    Param.string("str", ["const"]),
    Param.string("substr", ["const"]),
  ]),
  strcpy: Func.string("strcpy", [
    Param.string("dest", [], ["restrict"]),
    Param.string("src", [], ["restrict"]),
  ]),
  strncpy: Func.string("strncpy", [
    Param.string("dest", [], ["restrict"]),
    Param.string("src", [], ["restrict"]),
    Param.size_t("count"),
  ]),
  strncmp: Func.int("strncmp", [
    Param.string("lhs", ["const"]),
    Param.string("rhs", ["const"]),
    Param.size_t("count"),
  ]),
};
