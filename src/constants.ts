import { Type } from "./type";
import { Val } from "./value";

export const NULL = Val.new(Type.void().ptr(), "NULL");
export const NULL_TERM = Val.char("\0");

export const MACRO_TYPE = Type.simple("macro");
