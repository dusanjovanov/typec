import { Directive } from "../directive";
import { Func } from "../func";
import { Operator } from "../operators";
import { Param } from "../param";
import { Type } from "../type";

const malloc = Func.new(Type.voidPointer(), "malloc", [Param.size_t("_Size")]);

export const stdlib = {
  include: Directive.includeSystem("stdlib.h"),
  malloc,
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
  mallocForType: (type: Type) => {
    return malloc.call(Operator.sizeOf(type));
  },
};
