import { block, chunk, curly } from "./chunk";
import type { StringLike } from "./types";

export class TcIf {
  constructor(cond: StringLike, body: string[]) {
    this.str.push(condBlock("if", cond, body));
  }
  str: string[] = [];

  _elseif(cond: StringLike, body: string[]) {
    this.str.push(condBlock("else if", cond, body));
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

const condBlock = (type: CondBlockType, cond: StringLike, body: string[]) => {
  return `${type}(${cond})${block(body)}`;
};

export const _if = (cond: StringLike, body: string[]) => {
  return new TcIf(cond, body);
};

export const ifOnly = (cond: StringLike, body: string[]) => {
  return condBlock("if", cond, body);
};

type CondBlockType = "if" | "else if";
