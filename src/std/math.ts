import { Directive } from "../directive";
import { Func } from "../func";
import { Param } from "../param";

export const math = {
  include: Directive.includeSystem("math.h"),
  sin: Func.double("sin", [Param.double("x")]),
  cos: Func.double("cos", [Param.double("x")]),
  acos: Func.double("acos", [Param.double("x")]),
  atan2: Func.double("atan2", [Param.double("x"), Param.double("y")]),
};
