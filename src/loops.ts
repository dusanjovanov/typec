import { block } from "./chunk";
import type { StringLike } from "./types";

export const whileLoop = (condition: StringLike, body: string[]) => {
  return `while(${condition})${block(body)}`;
};
