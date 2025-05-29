import { Dir } from "./directive";
import { Fn } from "./func";
import { Param } from "./param";
import { Type } from "./type";

export const posix = {
  includeUni: Dir.includeSys("unistd.h"),
  posix_memalign: Fn.int("posix_memalign", [
    Param.new(Type.voidPointer().pointer(), "memptr"),
    Param.size_t("alignment"),
    Param.size_t("size"),
  ]),
};
