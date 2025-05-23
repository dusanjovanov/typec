import { Directive } from "../directive";
import { Fn } from "../func";
import { Param } from "../param";
import { Type } from "../type";

export const stdlib = {
  include: Directive.includeSys("stdlib.h"),
  malloc: Fn.new(Type.void().pointer(), "malloc", [Param.size_t("size")]),
  calloc: Fn.new(Type.void().pointer(), "calloc", [
    Param.size_t("count"),
    Param.size_t("size"),
  ]),
  realloc: Fn.new(Type.void().pointer(), "realloc", [
    Param.new(Type.void().pointer(), "block"),
    Param.size_t("size"),
  ]),
  free: Fn.void("free", [Param.new(Type.void().pointer(), "block")]),
  aligned_alloc: Fn.new(Type.void().pointer(), "aligned_alloc", [
    Param.size_t("alignment"),
    Param.size_t("size"),
  ]),
};
