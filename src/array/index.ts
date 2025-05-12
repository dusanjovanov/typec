import { destroyDynamic } from "./destroyDynamic";
import { forEachDynamic, forEachDynamicCallback } from "./forEachDynamic";
import { initDynamic } from "./initDynamic";
import { insertDynamic } from "./insertDynamic";
import { DynamicArray } from "./types";

/** tc equivalent of the JS Array class. */
export const array = {
  DynamicArray,
  initDynamic,
  insertDynamic,
  destroyDynamic,
  forEachDynamic,
  forEachDynamicCallback,
};
