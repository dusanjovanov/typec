import { NULL } from "../constants";
import { Func } from "../func";
import { Param } from "../param";
import { stdlib } from "../std";
import { DynamicArray } from "./types";

export const destroyDynamic = Func.void(
  "tc_array_dynamic_destroy",
  [Param.new(DynamicArray.type().pointer(), "array")],
  ({ params }) => {
    const { array } = params;
    return [
      stdlib.free.call(array.arrow("items")),
      array.assignMultipleArrow({
        items: NULL,
        count: 0,
        size: 0,
      }),
    ];
  }
);
