import { Dir } from "../directive";
import { Fn } from "../func";
import { Param } from "../param";
import { Type } from "../type";

export const stdlib = {
  include: Dir.includeSys("stdlib.h"),
  malloc: Fn.new(Type.voidPointer(), "malloc", [Param.size_t("size")]),
  calloc: Fn.new(Type.voidPointer(), "calloc", [
    Param.size_t("count"),
    Param.size_t("size"),
  ]),
  realloc: Fn.new(Type.voidPointer(), "realloc", [
    Param.new(Type.voidPointer(), "block"),
    Param.size_t("size"),
  ]),
  free: Fn.void("free", [Param.new(Type.voidPointer(), "block")]),
  aligned_alloc: Fn.new(Type.voidPointer(), "aligned_alloc", [
    Param.size_t("alignment"),
    Param.size_t("size"),
  ]),
};
