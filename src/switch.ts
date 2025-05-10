import { Block, Chunk } from "./chunk";
import type { CodeLike } from "./types";

/** `switch` control statement. */
export class Switch {
  constructor(exp: CodeLike) {
    this.exp = exp;
    this.statements = [];
  }
  kind = "switch" as const;
  exp;
  statements: string[];

  case(exp: CodeLike, body: CodeLike[]) {
    this.statements.push(`case ${exp}:${Block.new(...body)}`);
    return this;
  }

  default(body: CodeLike[]) {
    this.statements.push(`default:${Block.new(...body)}`);
    return this;
  }

  toString() {
    return Chunk.new([
      `switch(${this.exp})${Block.new(...this.statements)}`,
    ]).toString();
  }

  static new(exp: CodeLike) {
    return new Switch(exp);
  }
}
