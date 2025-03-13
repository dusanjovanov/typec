import { block, chunk } from "./chunk";
import type { StringLike } from "./types";

export class Condition {
  constructor(cond: StringLike, body: string[]) {
    this.str.push(condBlock("if", cond, body));
  }
  str: string[] = [];

  elseif(cond: StringLike, body: string[]) {
    this.str.push(condBlock("else if", cond, body));
    return this;
  }

  else(body: string[]) {
    this.str.push(`else${block(body)}`);
    return this;
  }

  toString() {
    return chunk(this.str);
  }

  /**
   * Starts a control block if statement that can be chained with else if and else.
   *
   * The class has a `.toString()` so you can just pass the object to a string evaluated expression like a template string.
   */
  static if(cond: StringLike, body: string[]) {
    return new Condition(cond, body);
  }

  /** When you need just one if statement. Returns a string. */
  static if_only = (cond: StringLike, body: string[]) => {
    return condBlock("if", cond, body);
  };
}

const condBlock = (type: CondBlockType, cond: StringLike, body: string[]) => {
  return `${type}(${cond})${block(body)}`;
};

type CondBlockType = "if" | "else if";
