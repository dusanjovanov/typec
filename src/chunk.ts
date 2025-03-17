import type { CodeLike } from "./types";

/** Takes in an array of statements as strings and adds semicolons and new lines appropriately. */
export const chunk = (statements: CodeLike[]) => {
  return statements
    .map((b) => {
      const str = b.toString();

      const lastChar = str.at(-1);
      if (
        str[0] !== "#" &&
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
export const curly = (code: CodeLike) => {
  return `{${code}}`;
};

/** Chunk of code within curly braces. */
export const block = (statements: CodeLike[]) => {
  return `\n${curly(`\n${chunk(statements)}\n`)}`;
};
