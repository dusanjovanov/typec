import { Val } from "./rValue";
import { Type } from "./type";

export const NULL = Val.macro("NULL", Type.void().pointer());
export const NULL_TERM = Val.char("\0");

export const MACRO_TYPE = Type.simple("macro");
