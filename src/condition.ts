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

  static any(values: ValArg[], body: StatArg[]) {
    const _values = values.map((v) => Val.valArgToVal(v));
    let exp = _values[0];
    _values.slice(1).forEach((v) => {
      exp = exp.or(v);
    });
    return Cond.if(exp, body);
  }

  static anyReturn(values: ValArg[], returnValue?: ValArg) {
    return Cond.any(values, [Stat.return(returnValue)]);
  }

  static anyEqual(values: ValArg[], valueToCheck: ValArg, body: StatArg[]) {
    const valToCheck = Val.valArgToVal(valueToCheck);
    return Cond.any(
      values.map((v) => Val.valArgToVal(v).equal(valToCheck)),
      body
    );
  }

  static anyEqualReturn(
    values: ValArg[],
    valueToCheck: ValArg,
    returnValue?: ValArg
  ) {
    return Cond.anyEqual(values, valueToCheck, [Stat.return(returnValue)]);
  }

  /**
   * Returns a condition that checks if any of the values are falsy (`!`).
   */
  static anyNot(values: ValArg[], body: StatArg[]) {
    return Cond.any(
      values.map((v) => Val.valArgToVal(v).not()),
      body
    );
  }

  /**
   * Returns a condition that checks if any of the values are falsy (`!`)
   * and accepts an optional return value to be returned in the body of the if.
   */
  static anyNotReturn(values: ValArg[], returnValue?: ValArg) {
    return Cond.anyNot(values, [Stat.return(returnValue)]);
  }
}
