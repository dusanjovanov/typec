import { Dir } from "../directive";
import { Fn } from "../func";
import { Param } from "../param";
import { Type } from "../type";

export const stdstring = {
  include: Dir.includeSys("string.h"),
  strlen: Fn.new(Type.size_t(), "strlen", [Param.string("str")]),
  strnlen_s: Fn.new(Type.size_t(), "strnlen_s", [
    Param.string("str"),
    Param.size_t("strsz"),
  ]),
  strcat: Fn.string("strcat", [
    Param.string("dest"),
    Param.string("src", ["const"]),
  ]),
  strstr: Fn.string("strstr", [
    Param.string("str", ["const"]),
    Param.string("substr", ["const"]),
  ]),
  strcpy: Fn.string("strcpy", [
    Param.string("dest", [], ["restrict"]),
    Param.string("src", [], ["restrict"]),
  ]),
  strncpy: Fn.string("strncpy", [
    Param.string("dest", [], ["restrict"]),
    Param.string("src", [], ["restrict"]),
    Param.size_t("count"),
  ]),
  strncmp: Fn.int("strncmp", [
    Param.string("lhs", ["const"]),
    Param.string("rhs", ["const"]),
    Param.size_t("count"),
  ]),
  memcpy: Fn.void("memcpy", [
    Param.new(Type.voidPointer(), "dest"),
    Param.new(Type.voidPointer(["const"]), "src"),
    Param.size_t("n"),
  ]),
};
