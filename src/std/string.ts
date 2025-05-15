import { Dir } from "../directive";
import { Func } from "../func";
import { Par } from "../param";
import { Type } from "../type";

export const stdstring = {
  include: Dir.includeSystem("string.h"),
  strlen: Func.new(Type.size_t(), "strlen", [Par.string("str")]),
  strnlen_s: Func.new(Type.size_t(), "strnlen_s", [
    Par.string("str"),
    Par.size_t("strsz"),
  ]),
  strcat: Func.string("strcat", [
    Par.string("dest"),
    Par.string("src", ["const"]),
  ]),
  strstr: Func.string("strstr", [
    Par.string("str", ["const"]),
    Par.string("substr", ["const"]),
  ]),
  strcpy: Func.string("strcpy", [
    Par.string("dest", [], ["restrict"]),
    Par.string("src", [], ["restrict"]),
  ]),
  strncpy: Func.string("strncpy", [
    Par.string("dest", [], ["restrict"]),
    Par.string("src", [], ["restrict"]),
    Par.size_t("count"),
  ]),
  strncmp: Func.int("strncmp", [
    Par.string("lhs", ["const"]),
    Par.string("rhs", ["const"]),
    Par.size_t("count"),
  ]),
};
