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
  [Param.string("str", ["const"]), Param.int("start"), Param.int("end")],
  ({ params }) => {
    const len = Var.size_t("len");
    const copyLen = Var.size_t("copy_len");
    const result = Var.string("result");
    const startIdx = Var.int("start_idx");
    const endIdx = Var.int("end_idx");

    const { str, start, end } = params;

    return [
      // Return NULL if input string is NULL
      str.equalReturn(NULL, NULL),
      // Get the length of the input string
      len.init(stdstring.strlen(str)),
      // Handle start index (including negative)
      startIdx.declare(),
      startIdx.assign(start),
      startIdx.lt(0).then([startIdx.assign(len.plus(startIdx))]),
      startIdx.lt(0).then([startIdx.assign(0)]),
      startIdx.gt(len).then([startIdx.assign(len)]),
      // Handle end index (including negative, default to len if SIZE_MAX)
      endIdx.declare(),
      end
        .equal(-1)
        .then([endIdx.assign(len)])
        .else([
          endIdx.assign(end),
          endIdx.lt(0).then([endIdx.assign(len.plus(endIdx))]),
          endIdx.lt(startIdx).then([endIdx.assign(startIdx)]),
          endIdx.gt(len).then([endIdx.assign(len)]),
        ]),
      // Calculate length to copy
      copyLen.init(endIdx.minus(startIdx)),
      // Allocate memory for the sliced string (+1 for null terminator)
      result.init(stdlib.malloc(copyLen.plus(1)).cast(result.type)),
      // Return NULL if allocation fails
      result.equalReturn(NULL, NULL),
      // Copy the substring
      stdstring.strncpy(result, str.plus(startIdx), copyLen),
      // Ensure null termination
      result.subAssign(copyLen, NULL_TERM),
      result.return(),
    ];
  }
);
