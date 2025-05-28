import { BRANDING_MAP } from "./brand";
import { Stat } from "./statement";
import type { StatArg, ValArg } from "./types";
import { Val } from "./val";

/** `if / else if / else` block. */
export class Cond {
  constructor(cond: ValArg, statements: StatArg[]) {
    this.statements.push(Stat.if(cond, statements));
  }
  kind = BRANDING_MAP.cond;
  statements: Stat[] = [];

  elseif(cond: ValArg, body: StatArg[]) {
    this.statements.push(Stat.elseif(cond, body));
    return this;
  }

  else(body: StatArg[]) {
    this.statements.push(Stat.else(body));
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

  static all(values: ValArg[], body: StatArg[]) {
    const _values = values.map((v) => Val.valArgToVal(v));
    let exp = _values[0].not();
    _values.slice(1).forEach((v) => {
      exp = exp.and(v);
    });
    return Cond.if(exp, body);
  }

  static allReturn(values: ValArg[], returnValue?: ValArg) {
    return Cond.all(values, [Stat.return(returnValue)]);
  }

  static anyEqual(values: ValArg[], valueToCheck: ValArg, body: StatArg[]) {
    const _values = values.map((v) => Val.valArgToVal(v));
    const valToCheck = Val.valArgToVal(valueToCheck);
    let exp = _values[0].equal(valToCheck);
    _values.slice(1).forEach((v) => {
      exp = exp.or(v.equal(valToCheck));
    });
    return Cond.if(exp, body);
  }

  /**
   * Returns a condition that checks if any of the values are falsy (`!`).
   */
  static anyNot(values: ValArg[], body: StatArg[]) {
    const _values = values.map((v) => Val.valArgToVal(v));
    let exp = _values[0].not();
    _values.slice(1).forEach((v) => {
      exp = exp.or(v.not());
    });
    return Cond.if(exp, body);
  }

  /**
   * Returns a condition that checks if any of the values are falsy (`!`)
   * and accepts an optional return value to be returned in the body of the if.
   */
  static anyNotReturn(values: ValArg[], returnValue?: ValArg) {
    return Cond.anyNot(values, [Stat.return(returnValue)]);
  }
}
