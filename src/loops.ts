import { block } from "./chunk";
import type { CodeLike } from "./types";

export class Loop {
  /**
   * Returns a while loop statement.
   */
  static while(condition: CodeLike, body: CodeLike[]) {
    return `while(${condition})${block(body)}`;
  }
}
