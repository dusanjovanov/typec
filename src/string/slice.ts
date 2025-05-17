import { NULL, NULL_TERM } from "../constants";
import { Func } from "../func";
import { Param } from "../param";
import { stdlib, stdstring } from "../std";
import { Type } from "../type";
import { Var } from "../variable";

/** JS String.slice equivalent for C */
export const slice = Func.new(
  Type.string(),
  "str_slice",
  [Param.string("str", ["const"]), Param.size_t("start"), Param.size_t("end")],
  ({ params }) => {
    const len = Var.size_t("len");
    const sliceLen = Var.size_t("copyLen");
    const result = Var.string("result");
    const endIdx = Var.int("end_idx");

    const { str, start, end } = params;

    return [
      // Return NULL if input string is NULL
      str.equalReturn(NULL, NULL),
      // Get the length of the input string
      len.init(stdstring.strlen.call(str)),
      // Clamp start index: ensure it's within [0, len]
      start.clamp(0, len),
      // Determine end index: use string length if end is NULL, otherwise clamp
      endIdx.declare(),
      end
        .equal(NULL)
        .then([endIdx.assign(len)])
        .else([endIdx.assign(end.deRef()), endIdx.clamp(start, len)]),
      // calculate length to copy
      sliceLen.init(end.minus(start)),
      // Allocate memory for the sliced string (+1 for null terminator)
      result.init(stdlib.malloc.call(len.plus(1)).cast(result.type)),
      // Return NULL if allocation fails
      result.equalReturn(NULL, NULL),
      // Copy the substring
      stdstring.strncpy.call(result, str.plus(start), sliceLen),
      // Ensure null termination
      result.subAssign(sliceLen, NULL_TERM),
      result.return(),
    ];
  }
);
