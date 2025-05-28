import { Fn } from "./func";
import { Param } from "./param";
import { Type } from "./type";

export const mainFnWithArgs = Fn.int("main", [
  Param.int("argc"),
  Param.new(Type.array(Type.string()), "argv"),
]);

export const mainFnNoArgs = Fn.int("main", []);
