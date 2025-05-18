import { Stat } from "./statement";
import type { StatArg, ValArg } from "./types";

export class Loop {
  /**
   * Returns a while loop statement.
   */
  static while(condition: ValArg, body: StatArg[]) {
    return Stat.while(condition, body);
  }

  /**
   * Returns a for loop statement.
   */
  static for(init: StatArg, condition: ValArg, iter: ValArg, body: StatArg[]) {
    return Stat.for(init, condition, iter, body);
  }

  /**
   * Returns a do while loop statement.
   */
  static doWhile(statements: StatArg[], condition: ValArg) {
    return Stat.doWhile(statements, condition);
  }
}
