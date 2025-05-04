import { Lit } from "./literal";
import { Type } from "./type";
import { Value } from "./value";

export const NULL = Value.new("NULL");
export const NULL_TERM = Value.new(Lit.char("\0"));

export const MACRO_TYPE = Type.simple("macro");
