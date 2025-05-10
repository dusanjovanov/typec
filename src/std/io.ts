import { Directive } from "../directive";
import { Func } from "../func";
import { Param } from "../param";
import { Type } from "../type";

export const stdio = {
  include: Directive.includeSystem("stdio.h"),
  printf: Func.new(Type.int(), "printf", [Param.string("_Format")], undefined, {
    hasVarArgs: true,
  }),
  puts: Func.new(Type.int(), "puts", [Param.string("_Buffer", ["const"])]),
};
