import { block, chunk } from "./chunk";
import type { CodeLike } from "./types";

export class Condition {
  constructor(cond: CodeLike, body: CodeLike[]) {
    this.str.push(condBlock("if", cond, body));
  }
  str: CodeLike[] = [];

  elseif(cond: CodeLike, body: CodeLike[]) {
    this.str.push(condBlock("else if", cond, body));
    return this;
  }

  else(body: CodeLike[]) {
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
  static if(cond: CodeLike, body: CodeLike[]) {
    return new Condition(cond, body);
  }
}

const condBlock = (
  type: CondBlockType,
  cond: CodeLike,
  body: CodeLike[]
) => {
  return `${type}(${cond})${block(body)}`;
};

type CondBlockType = "if" | "else if";
