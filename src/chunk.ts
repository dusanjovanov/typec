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
    return this;
  }

  toString() {
    return this.statements
      .filter((s) => Boolean(s) && typeof s !== "boolean")
      .map((b) => {
        const str = b.toString();

        const lastChar = str.at(-1);
        if (
          str[0] !== "#" &&
          lastChar !== "}" &&
          lastChar !== ";" &&
          lastChar !== "\n"
        ) {
          return semicolon(b);
        }
        return b;
      })
      .join(`\n`);
  }

  static new(...statements: CodeLike[]) {
    return new Chunk(statements);
  }
}

/** Code between curly braces */
export const curly = (code: CodeLike) => {
  return `{${code}}`;
};

/** Adds a semicolon at the end. */
export const semicolon = (code: CodeLike) => {
  return `${code};`;
};
