import { block } from "./chunk";
import type { PassingValue } from "./types";

export const whileLoop = (condition: PassingValue, body: string[]) => {
  return `while(${condition})${block(body)}`;
};
