import { BRANDING_MAP } from "./brand";
import { Stat } from "./statement";
import type { StatArg, ValArg } from "./types";

/** `if / else if / else` block. */
export class Cond {
  constructor(cond: ValArg, statements: StatArg[]) {
    this.statements.push(Stat.if(cond, statements));
  }
  kind = BRANDING_MAP.cond;
  statements: Stat[] = [];

  elseif(cond: ValArg, statements: StatArg[]) {
    this.statements.push(Stat.elseif(cond, statements));
    return this;
  }

  else(statements: StatArg[]) {
    this.statements.push(Stat.else(statements));
    return this;
  }

  toString() {
    return Stat.chunk(this.statements);
  }

  /**
   * Starts a control `if` statement that can be chained with `elseif` and `else`.
   */
  static if(condition: ValArg, body: StatArg[]) {
    return new Cond(condition, body);
  }
}
