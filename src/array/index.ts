import { Func, type BodyFn } from "../func";
import { Param } from "../param";
import { Type } from "../type";
import { destroyDynamic } from "./destroyDynamic";
import { forEachDynamic } from "./forEachDynamic";
import { initDynamic } from "./initDynamic";
import { insert } from "./insertDynamic";
import { DynamicArray } from "./types";

const forEachDynamicParams = [
  Param.new(Type.voidPointer(), "element"),
  Param.new(Type.int(), "index"),
  DynamicArray.pointerParam("array"),
  Param.new(Type.voidPointer(), "user_data"),
] as const;

export const array = {
  DynamicArray,
  initDynamic,
  insert,
  destroyDynamic,
  forEachDynamic,
  /** Helper to create a forEach callback Func for a dynamic array. */
  forEachDynamicCallback: (
    name: string,
    body: BodyFn<typeof forEachDynamicParams>
  ) => {
    return Func.new(Type.void(), name, forEachDynamicParams, body);
  },
};
