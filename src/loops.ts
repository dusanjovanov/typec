import { Block } from "./chunk";
import type { CodeLike } from "./types";

export class Loop {
  /**
   * Returns a while loop statement.
   */
  static while(condition: CodeLike, body: CodeLike[]) {
    return `while(${condition})${Block.new(body)}`;
  }

  static for(
    init: CodeLike,
    condition: CodeLike,
    update: CodeLike,
    body: CodeLike[]
  ) {
    return `for(${init};${condition};${update};)${Block.new(body)}`;
  }
}
