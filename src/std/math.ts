import { Dir } from "../directive";
import { Func } from "../func";
import { Par } from "../param";

export const math = {
  include: Dir.includeSys("math.h"),
  sin: Func.double("sin", [Par.double("x")]),
  cos: Func.double("cos", [Par.double("x")]),
  acos: Func.double("acos", [Par.double("x")]),
  atan2: Func.double("atan2", [Par.double("x"), Par.double("y")]),
};
