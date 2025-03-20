import { Condition } from "../condition";
import { NULL, NULL_TERM } from "../constants";
import { Func } from "../func";
import { Param } from "../param";
import { StdLib, StdString } from "../std";
import { Type } from "../type";
import { Var } from "../variable";

/** JS String.slice equivalent for C */
export const strSlice = Func.new(
  Type.string(),
  "tc_str_slice",
  [
    Param.string("str", ["const"]),
    Param.size_t("start"),
    Param.new(Type.size_t(), "end"),
  ],
  ({ params }) => {
    const len = Var.size_t("len");
    const sliceLen = Var.size_t("copyLen");
    const result = Var.string("result");
    const endIdx = Var.int("end_idx");

    const { str, start, end } = params;

    return [
      // Return NULL if input string is NULL
      str.equalReturn(NULL),
      // Get the length of the input string
      len.init(StdString.strlen.call(str)),
      // Clamp start index: ensure it's within [0, len]
      start.clamp(0, len),
      // Determine end index: use string length if end is NULL, otherwise clamp
      endIdx.declare(),
      Condition.if(end.equal(NULL), [endIdx.assign(len)]).else([
        endIdx.assign(end.deRef()),
        endIdx.clamp(start, len),
      ]),
      // calculate length to copy
      sliceLen.init(end.minus(start)),
      // Allocate memory for the sliced string (+1 for null terminator)
      result.init(StdLib.malloc.call(len.plus(1)).cast(result.type)),
      // Return NULL if allocation fails
      result.equalReturn(NULL),
      // Copy the substring
      StdString.strncpy.call(result, str.plus(start), sliceLen),
      // Ensure null termination
      result.subAssign(sliceLen, NULL_TERM),
      Func.return(result),
    ];
  }
);
