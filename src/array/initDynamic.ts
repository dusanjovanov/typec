import { Func } from "../func";
import { Param } from "../param";
import { stdlib } from "../std";
import { Type } from "../type";
import { DynamicArray } from "./types";

export const initDynamic = Func.void(
  "tc_array_dynamic_init",
  [DynamicArray.pointerParam("array"), Param.new(Type.size_t(), "size")],
  ({ params }) => {
    const { array, size } = params;
    return [
      array.assignMultipleArrow({
        count: 0,
        size,
        items: stdlib.malloc.call(
          array.arrow("size").mul(Type.void().pointer().sizeOf())
        ),
      }),
      array.arrow("items").notThen([array.arrow("size").assign(0)]),
    ];
  }
);
