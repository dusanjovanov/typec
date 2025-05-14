import { NULL } from "../constants";
import { Func, type BodyFn } from "../func";
import { Loop } from "../loops";
import { Par } from "../param";
import { stdlib } from "../std";
import { Type } from "../type";
import { Var } from "../variable";
import { DynamicArray } from "./types";

export const initDynamic = Func.void(
  "tc_array_dynamic_init",
  [DynamicArray.ptrPar("array"), Par.new(Type.size_t(), "size")],
  ({ params }) => {
    const { array, size } = params;
    return [
      array.assignArrowMulti({
        count: 0,
        size,
        items: stdlib.malloc.call(
          array.arrow("size").mul(Type.void().ptr().sizeOf())
        ),
      }),
      array.arrow("items").notThen([array.arrow("size").assign(0)]),
    ];
  }
);

const forEachDynamicParams = [
  Par.new(Type.void().ptr(), "element"),
  Par.new(Type.int(), "index"),
  DynamicArray.ptrPar("array"),
  Par.new(Type.void().ptr(), "user_data"),
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
    DynamicArray.ptrPar("array"),
    Par.new(
      Type.func(
        Type.void(),
        forEachDynamicParams as unknown as Par<any, any>[]
      ),
      "callback"
    ),
    Par.new(Type.void().ptr(), "user_data"),
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

export const pushDynamic = Func.void(
  "tc_array_dynamic_push",
  [DynamicArray.ptrPar("array"), Par.new(Type.void().ptr(), "item")],
  ({ params }) => {
    const { array, item } = params;
    const newSize = Var.new(Type.size_t(), "new_size");
    const newItems = Var.new(Type.void().ptr().ptr(), "new_items");
    return [
      array
        .arrow("count")
        .lte(array.arrow("size"))
        .then([
          newSize.init(array.arrow("size").mul(2)),
          newItems.init(
            stdlib.realloc.call(
              array.arrow("items"),
              newSize.mul(Type.void().ptr().sizeOf())
            )
          ),
          newItems.notReturn(),
          array.assignArrowMulti({
            items: newItems,
            size: newSize,
          }),
        ]),
      array.arrow("items").at(array.arrow("count").postInc()).assign(item),
    ];
  }
);

export const destroyDynamic = Func.void(
  "tc_array_dynamic_destroy",
  [Par.new(DynamicArray.type().ptr(), "array")],
  ({ params }) => {
    const { array } = params;
    return [
      stdlib.free.call(array.arrow("items")),
      array.assignArrowMulti({
        items: NULL,
        count: 0,
        size: 0,
      }),
    ];
  }
);
