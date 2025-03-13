import { block } from "./chunk";
import type { PassingValue } from "./types";

export class Loop {
  /**
   * Returns a while loop statement.
   */
  static while(condition: PassingValue, body: string[]) {
    return `while(${condition})${block(body)}`;
  }
}
