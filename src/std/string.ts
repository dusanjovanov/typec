import { Func } from "../func";
import { Include } from "../include";
import { lib } from "../lib";
import { Param } from "../param";
import { Type } from "../type";

export const stdstring = lib({
  externals: [
    {
      include: Include.system("string.h"),
      api: {
        strlen: Func.new(Type.size_t(), "strlen", [Param.string("str")]),
        strnlen_s: Func.new(Type.size_t(), "strnlen_s", [
          Param.string("str"),
          Param.size_t("strsz"),
        ]),
        strcat: Func.new(Type.string(), "strcat", [
          Param.string("dest"),
          Param.string("src", ["const"]),
        ]),
        strstr: Func.new(Type.string(), "strstr", [
          Param.string("str", ["const"]),
          Param.string("substr", ["const"]),
        ]),
        strcpy: Func.new(Type.string(), "strcpy", [
          Param.string("dest", [], ["restrict"]),
          Param.string("src", [], ["restrict"]),
        ]),
        strncpy: Func.new(Type.string(), "strncpy", [
          Param.string("dest", [], ["restrict"]),
          Param.string("src", [], ["restrict"]),
          Param.size_t("count"),
        ]),
        strncmp: Func.new(Type.int(), "strncmp", [
          Param.string("lhs", ["const"]),
          Param.string("rhs", ["const"]),
          Param.size_t("count"),
        ]),
      },
    },
  ],
});
