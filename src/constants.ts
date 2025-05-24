import { Type } from "./type";
import { Val } from "./val";

export const NULL = Val.macro("NULL", Type.voidPointer());
export const NULL_TERM = Val.char("\0");

export const MACRO_TYPE = Type.simple("macro");
