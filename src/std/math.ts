import { Directive } from "../directive";
import { Fn } from "../func";
import { Param } from "../param";

export const math = {
  include: Directive.includeSys("math.h"),
  sin: Fn.double("sin", [Param.double("x")]),
  cos: Fn.double("cos", [Param.double("x")]),
  acos: Fn.double("acos", [Param.double("x")]),
  atan2: Fn.double("atan2", [Param.double("x"), Param.double("y")]),
  fminf: Fn.float("fminf", [Param.float("x"), Param.float("y")]),
  fmaxf: Fn.float("fmaxf", [Param.float("x"), Param.float("y")]),
};
