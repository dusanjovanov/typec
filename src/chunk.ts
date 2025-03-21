import type { CodeLike } from "./types";

/**
 * A collection of C code statements. Can be stringified.
 *
 * When turned to a string, it formats the statements by adding semicolons and new lines appropriately.
 */
export class Chunk {
  constructor(statements: CodeLike[]) {
    this.statements = statements;
  }
  statements;

  /** Add statements to the Chunk. */
  add(...statements: CodeLike[]) {
    this.statements.push(...statements);
  }

  toString() {
    return this.statements
      .map((b) => {
        const str = b.toString();

        const lastChar = str.at(-1);
        if (
          str[0] !== "#" &&
          lastChar !== "}" &&
          lastChar !== ";" &&
          lastChar !== "\n" &&
          lastChar !== ""
        ) {
          return `${b};`;
        }
        return b;
      })
      .join(`\n`);
  }

  static new(statements: CodeLike[]) {
    return new Chunk(statements);
  }
}

/** A block of code or chunk within curly braces. Can be stringified. */
export class Block {
  constructor(statements: CodeLike[]) {
    this.chunk = Chunk.new(statements);
  }
  chunk;

  /** Add statements to the Block. */
  add(...statements: CodeLike[]) {
    this.chunk.statements.push(...statements);
  }

  toString() {
    return `\n${curly(`\n${this.chunk}\n`)}`;
  }

  static new(statements: CodeLike[]) {
    return new Block(statements);
  }
}

/** Code between curly braces */
export const curly = (code: CodeLike) => {
  return `{${code}}`;
};
