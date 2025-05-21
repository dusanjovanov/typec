import { NULL } from "../constants";
import { Func, type BodyFn } from "../func";
import { Loop } from "../loops";
import { Param } from "../param";
import { stdlib } from "../std";
import { Type } from "../type";
import { Var } from "../variable";
import { DynamicArray } from "./types";

export const initDynamic = Func.void(
  "tc_array_dynamic_init",
  [
    Param.structPointer(DynamicArray, "array"),
    Param.new(Type.size_t(), "size"),
  ],
  ({ params }) => {
    const { array, size } = params;
    return [
      ...array.assignArrowMulti({
        count: 0,
        size,
        items: stdlib.malloc(array._.size.mul(Type.void().pointer().sizeOf())),
      }),
      array._.items.notThen([array._.size.assign(0)]),
    ];
  }
);

const forEachDynamicParams = [
  Param.new(Type.void().pointer(), "element"),
  Param.new(Type.int(), "index"),
  Param.new(DynamicArray.pointer(), "array"),
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
    Param.structPointer(DynamicArray, "array"),
    Param.new(Type.func(Type.void(), forEachDynamicParams), "callback"),
    Param.new(Type.void().pointer(), "user_data"),
  ],
  ({ params }) => {
    const { array, callback, user_data } = params;
    const i = Var.int("i");

    return [
      Loop.for(i.init(0), i.lt(array._.count), i.postDec(), [
        callback.call(array._.items.at(i), i, array, user_data),
      ]),
    ];
  }
);

export const pushDynamic = Func.void(
  "tc_array_dynamic_push",
  [
    Param.structPointer(DynamicArray, "array"),
    Param.new(Type.void().pointer(), "item"),
  ],
  ({ params }) => {
    const { array, item } = params;
    const newSize = Var.new(Type.size_t(), "new_size");
    const newItems = Var.new(Type.void().pointer().pointer(), "new_items");
    return [
      array
        .arrow("count")
        .lte(array._.size)
        .then([
          newSize.init(array._.size.mul(2)),
          newItems.init(
            stdlib.realloc(
              array._.items,
              newSize.mul(Type.void().pointer().sizeOf())
            )
          ),
          newItems.notReturn(),
          ...array.assignArrowMulti({
            items: newItems,
            size: newSize,
          }),
        ]),
      array._.items.at(array._.count.postInc()).assign(item),
    ];
  }
);

export const destroyDynamic = Func.void(
  "tc_array_dynamic_destroy",
  [Param.structPointer(DynamicArray, "array")],
  ({ params }) => {
    const { array } = params;
    return [
      stdlib.free(array._.items),
      ...array.assignArrowMulti({
        items: NULL,
        count: 0,
        size: 0,
      }),
    ];
  }
);
