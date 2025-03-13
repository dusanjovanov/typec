import type { PassingValue } from "./types";

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

export const curly = (code: PassingValue) => {
  return `{${code}}`;
};

export const block = (statements: string[]) => {
  return `\n${curly(`\n${chunk(statements)}\n`)}`;
};
