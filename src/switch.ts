import { BRANDING_MAP } from "./branding";
import { Stat } from "./statement";
import type { StatArg, ValArg } from "./types";

/** `switch` control statement. */
export class Switch {
  constructor(exp: ValArg) {
    this.exp = exp;
    this.statements = [];
  }
  kind = BRANDING_MAP.switch;
  exp;
  statements: Stat[];

  case(value: ValArg, statements: StatArg[]) {
    this.statements.push(Stat.case(value, statements));
    return this;
  }

  default(statements: StatArg[]) {
    this.statements.push(Stat.default(statements));
    return this;
  }

  toString() {
    return `switch(${this.exp})${Stat.block(this.statements)}`;
  }

  static new(exp: ValArg) {
    return new Switch(exp);
  }
}
