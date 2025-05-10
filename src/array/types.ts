import { Struct } from "../struct";
import { Type } from "../type";

export const DynamicArray = Struct.new("tc_DynamicArray", {
  items: Type.void().pointer().pointer(),
  count: Type.size_t(),
  size: Type.size_t(),
});
