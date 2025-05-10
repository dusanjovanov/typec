import { Func } from "../func";
import { Loop } from "../loops";
import { Param } from "../param";
import { Type } from "../type";
import { Var } from "../variable";
import { DynamicArray } from "./types";

export const forEachDynamic = Func.new(
  Type.void(),
  "tc_array_dynamic_for_each",
  [
    Param.new(DynamicArray.pointerType(), "array"),
    Param.new(
      Type.func(Type.void(), [
        Type.voidPointer(),
        Type.int(),
        DynamicArray.pointerType(),
        Type.voidPointer(),
      ]),
      "callback"
    ),
    Param.new(Type.voidPointer(), "user_data"),
  ],
  ({ params }) => {
    const { array, callback, user_data } = params;
    const i = Var.int("i");

    return [
      Loop.for(i.init(0), i.lt(array.arrow("count")), i.postDec(), [
        callback.call(array.arrow("items").at(i), i, array, user_data),
      ]),
    ];
  }
);
