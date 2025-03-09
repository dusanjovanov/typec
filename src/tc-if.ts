import { block, chunk, curly } from "./chunk";
import type { TextLike } from "./types";

export class TcIf {
  constructor(cond: TextLike, body: string[]) {
    this._condBlock("if", cond, body);
  }
  str: string[] = [];

  private _condBlock(type: CondBlockType, cond: TextLike, body: string[]) {
    this.str.push(condBlock(type, cond, body));
  }

  _elseif(cond: TextLike, body: string[]) {
    this._condBlock("else if", cond, body);
    return this;
  }

  _else(body: string[]) {
    this.str.push(`else${curly(chunk(body))}`);
    return this;
  }

  toString() {
    return chunk(this.str);
  }
}

const condBlock = (type: CondBlockType, cond: TextLike, body: string[]) => {
  return `${type}(${cond})${block(body)}`;
};

/**
 * Starts control block if statement that can be chained with else if and else.
 * Finally returns a string with `.toString()`.
 */
export const _if = (cond: TextLike, body: string[]) => {
  return new TcIf(cond, body);
};

/**
 * Returns just the if block.
 */
export const ifOnly = (cond: TextLike, body: string[]) => {
  return condBlock("if", cond, body);
};

type CondBlockType = "if" | "else if";
