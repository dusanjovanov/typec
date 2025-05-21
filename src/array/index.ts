import {
  destroyDynamic,
  forEachDynamic,
  forEachDynamicCallback,
  initDynamic,
  pushDynamic,
} from "./dynamic";
import { DynamicArray } from "./types";

/** tc equivalent of the JS Array class. */
export const tc_arr = {
  DynamicArray,
  initDynamic,
  pushDynamic,
  destroyDynamic,
  forEachDynamic,
  forEachDynamicCallback,
  dynamicArrayApi: {
    init: initDynamic,
    push: pushDynamic,
    forEach: forEachDynamic,
    destroy: destroyDynamic,
  },
};
