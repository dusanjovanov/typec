import { Directive } from "../directive";
import { Func } from "../func";
import { Param } from "../param";
import { Type } from "../type";

export const stdmath = {
  include: Directive.includeSystem("math.h"),
  sin: Func.new(Type.double(), "sin", [Param.new(Type.double(), "x")]),
  cos: Func.new(Type.double(), "cos", [Param.new(Type.double(), "x")]),
  acos: Func.new(Type.double(), "acos", [Param.new(Type.double(), "x")]),
  atan2: Func.new(Type.double(), "atan2", [
    Param.new(Type.double(), "x"),
    Param.new(Type.double(), "y"),
  ]),
};
