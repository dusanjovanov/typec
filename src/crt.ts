import { Dir } from "./directive";
import { Fn } from "./func";
import { Param } from "./param";
import { Type } from "./type";
import { Val } from "./val";

/** Microsoft C runtime library  */
export const crt = {
  includeMalloc: Dir.includeSys("malloc.h"),
  _WIN32: Val.macro("_WIN32"),
  _WIN64: Val.macro("_WIN64"),
  _aligned_malloc: Fn.new(Type.voidPointer(), "_aligned_malloc", [
    Param.size_t("size"),
    Param.size_t("alignment"),
  ]),
  _aligned_realloc: Fn.new(Type.voidPointer(), "_aligned_realloc", [
    Param.new(Type.voidPointer(), "memblock"),
    Param.size_t("size"),
    Param.size_t("alignment"),
  ]),
  _aligned_free: Fn.void("_aligned_free", [
    Param.new(Type.voidPointer(), "memblock"),
  ]),
};
