import { Directive } from "../directive";
import { Func } from "../func";
import { Param } from "../param";

export const stdio = {
  include: Directive.includeSystem("stdio.h"),
  printf: Func.int("printf", [Param.string("_Format")], undefined, {
    hasVarArgs: true,
  }),
  puts: Func.int("puts", [Param.string("_Buffer", ["const"])]),
};
