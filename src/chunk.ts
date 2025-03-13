import type { PassingValue } from "./types";

/** Takes in an array of statements as strings and adds semicolons and new lines appropriately. */
export const chunk = (statements: string[]) => {
  return statements
    .map((b) => {
      const lastChar = b.at(-1);
      if (
        b[0] !== "#" &&
        lastChar !== "}" &&
        lastChar !== ";" &&
        lastChar !== "\n"
      ) {
        return `${b};`;
      }
      return b;
    })
    .join(`\n`);
};

/** Code between curly braces */
export const curly = (code: PassingValue) => {
  return `{${code}}`;
};

/** Chunk of code within curly braces. */
export const block = (statements: string[]) => {
  return `\n${curly(`\n${chunk(statements)}\n`)}`;
};
