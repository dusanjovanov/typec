import { Dir } from "../directive";
import { Func } from "../func";
import { Par } from "../param";
import { Type } from "../type";

export const stdlib = {
  include: Dir.includeSystem("stdlib.h"),
  malloc: Func.new(Type.void().ptr(), "malloc", [Par.size_t("_Size")]),
  calloc: Func.new(Type.void().ptr(), "calloc", [
    Par.size_t("_Count"),
    Par.size_t("_Size"),
  ]),
  realloc: Func.new(Type.void().ptr(), "realloc", [
    Par.new(Type.void().ptr(), "_Block"),
    Par.size_t("_Size"),
  ]),
  free: Func.void("free", [Par.new(Type.void().ptr(), "_Block")]),
};
