import { Block } from "./chunk";
import type { CodeLike } from "./types";

export class Loop {
  /**
   * Returns a while loop statement.
   */
  static while(condition: CodeLike, body: CodeLike[]) {
    return `while(${condition})${Block.new(...body)}`;
  }

  /**
   * Returns a for loop statement.
   */
  static for(
    init: CodeLike,
    condition: CodeLike,
    update: CodeLike,
    body: CodeLike[]
  ) {
    return `for(${init};${condition};${update})${Block.new(...body)}`;
  }

  /**
   * Returns a do while loop statement.
   */
  static doWhile(body: CodeLike[], condition: CodeLike) {
    return `do${Block.new(...body)}while(${condition})`;
  }
}
