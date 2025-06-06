import { Stat } from "./statement";
import type { StatArg, ValArg } from "./types";
import { Var } from "./variable";

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
  static doWhile(body: StatArg[], condition: ValArg) {
    return Stat.doWhile(body, condition);
  }

  /**
   * Returns a for loop statement that goes from `start` to `end-1`.
   */
  static range(counterVar: Var, start: ValArg, end: ValArg, body: StatArg[]) {
    const i = counterVar;
    return Loop.for(i.init(start), i.lt(end), i.postInc(), body);
  }
}
