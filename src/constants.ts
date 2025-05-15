import { Val } from "./rValue";
import { Type } from "./type";

export const NULL = Val.new(Type.void().ptr(), "NULL");
export const NULL_TERM = Val.char("\0");

export const MACRO_TYPE = Type.simple("macro");
