import { Block, Chunk } from "./chunk";
import type { CodeLike } from "./types";

export class Condition {
  constructor(condition: CodeLike, body: CodeLike[]) {
    this.str.push(condBlock("if", condition, body));
  }
  kind = "condition" as const;
  str: CodeLike[] = [];

  elseif(condition: CodeLike, body: CodeLike[]) {
    this.str.push(condBlock("else if", condition, body));
    return this;
  }

  else(body: CodeLike[]) {
    this.str.push(`else${Block.new(body)}`);
    return this;
  }

  toString() {
    return Chunk.new(this.str).toString();
  }

  /**
   * Starts a control block if statement that can be chained with else if and else.
   *
   * The class has a `.toString()` so you can just pass the object to a string evaluated expression like a template string.
   */
  static if(condition: CodeLike, body: CodeLike[]) {
    return new Condition(condition, body);
  }
}

const condBlock = (
  type: CondBlockType,
  condition: CodeLike,
  body: CodeLike[]
) => {
  return `${type}(${condition})${Block.new(body)}`;
};

type CondBlockType = "if" | "else if";
