import { Func } from "../func";
import { Param } from "../param";
import { stdlib } from "../std";
import { Type } from "../type";
import { Var } from "../variable";
import { DynamicArray } from "./types";

export const insertDynamic = Func.void(
  "tc_array_dynamic_insert",
  [
    DynamicArray.pointerParam("array"),
    Param.new(Type.void().pointer(), "item"),
  ],
  ({ params }) => {
    const { array, item } = params;
    const newSize = Var.new(Type.size_t(), "new_size");
    const newItems = Var.new(Type.void().pointer().pointer(), "new_items");
    return [
      array
        .arrow("count")
        .lte(array.arrow("size"))
        .then([
          newSize.init(array.arrow("size").mul(2)),
          newItems.init(
            stdlib.realloc.call(
              array.arrow("items"),
              newSize.mul(Type.void().pointer().sizeOf())
            )
          ),
          newItems.notReturn(),
          array.assignMultipleArrow({
            items: newItems,
            size: newSize,
          }),
        ]),
      array.arrow("items").at(array.arrow("count").postInc()).assign(item),
    ];
  }
);
