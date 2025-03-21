import { Func } from "../func";
import { Include } from "../include";
import { lib } from "../lib";
import { Param } from "../param";
import { Type } from "../type";

export const stdlib = lib({
  externals: [
    {
      include: Include.system("stdlib.h"),
      api: {
        malloc: Func.new(Type.voidPointer(), "malloc", [Param.size_t("_Size")]),
        calloc: Func.new(Type.voidPointer(), "calloc", [
          Param.size_t("_Count"),
          Param.size_t("_Size"),
        ]),
        realloc: Func.new(Type.voidPointer(), "realloc", [
          Param.new(Type.voidPointer(), "_Block"),
          Param.size_t("_Size"),
        ]),
        free: Func.new(Type.void(), "free", [
          Param.new(Type.voidPointer(), "_Block"),
        ]),
      },
    },
  ],
});
