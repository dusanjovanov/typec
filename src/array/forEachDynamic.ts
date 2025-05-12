import { Func, type BodyFn } from "../func";
import { Loop } from "../loops";
import { Param } from "../param";
import { Type } from "../type";
import { Var } from "../variable";
import { DynamicArray } from "./types";

const forEachDynamicParams = [
  Param.new(Type.void().pointer(), "element"),
  Param.new(Type.int(), "index"),
  DynamicArray.pointerParam("array"),
  Param.new(Type.void().pointer(), "user_data"),
] as const;

/** Helper to create a forEach callback Func for a dynamic array. */
export const forEachDynamicCallback = (
  name: string,
  body: BodyFn<typeof forEachDynamicParams>
) => {
  return Func.void(name, forEachDynamicParams, body);
};

export const forEachDynamic = Func.void(
  "tc_array_dynamic_for_each",
  [
    DynamicArray.pointerParam("array"),
    Param.new(
      Type.func(Type.void(), forEachDynamicParams as unknown as Param[]),
      "callback"
    ),
    Param.new(Type.void().pointer(), "user_data"),
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
