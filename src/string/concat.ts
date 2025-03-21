import { Condition } from "../condition";
import { NULL } from "../constants";
import { Func } from "../func";
import { Loop } from "../loops";
import { Param } from "../param";
import { stdlib, stdstring, VarArgs } from "../std";
import { Type } from "../type";
import { Var } from "../variable";

/** JS String.concat equivalent for C */
export const concat = Func.new(
  Type.string(),
  "tc_str_concat",
  [Param.string("str", ["const"])],
  ({ params }) => {
    const totalLen = Var.size_t("total_len");
    const varArgs = VarArgs.new();
    const nextStr = Var.string("next_str", ["const"]);
    const result = Var.string("result");

    const { str } = params;

    return [
      // Return NULL if the initial string is NULL
      str.equalReturn(NULL),
      // Start with the length of the first string
      totalLen.init(stdstring.strlen.call(str)),
      varArgs.declare(),
      varArgs.start(str),
      nextStr.declare(),
      Loop.while(nextStr.assign(varArgs.nextArg(nextStr.type)).notEqual(NULL), [
        // Double-check to avoid issues with NULL in list
        Condition.if(nextStr.notEqual(NULL), [
          totalLen.plusAssign(stdstring.strlen.call(nextStr)),
        ]),
      ]),
      varArgs.end(),
      // Allocate memory for the result (+1 for null terminator)
      result.init(stdlib.malloc.call(totalLen.plus(1))),
      result.equalReturn(NULL),
      // Copy the first string
      stdstring.strcpy.call(result, str),
      // Second pass: Concatenate all additional strings
      varArgs.start(str),
      Loop.while(nextStr.assign(varArgs.nextArg(nextStr.type)).notEqual(NULL), [
        Condition.if(nextStr.notEqual(NULL), [
          stdstring.strcat.call(result, nextStr),
        ]),
      ]),
      varArgs.end(),
      Func.return(result),
    ];
  },
  { hasVarArgs: true }
);
