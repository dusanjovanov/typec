import { Directive } from "../directive";
import { Func } from "../func";
import { Param } from "../param";
import { Type } from "../type";

export const stdlib = {
  include: Directive.includeSystem("stdlib.h"),
  malloc: Func.new(Type.void().pointer(), "malloc", [Param.size_t("_Size")]),
  calloc: Func.new(Type.void().pointer(), "calloc", [
    Param.size_t("_Count"),
    Param.size_t("_Size"),
  ]),
  realloc: Func.new(Type.void().pointer(), "realloc", [
    Param.new(Type.void().pointer(), "_Block"),
    Param.size_t("_Size"),
  ]),
  free: Func.void("free", [Param.new(Type.void().pointer(), "_Block")]),
};
