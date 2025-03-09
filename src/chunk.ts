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

/** Statements ( chunk ) between curly braces and adds new lines. */
export const curly = (chunk: string) => {
  return `\n{\n${chunk}\n}`;
};

/** Chunk of code within curly braces. */
export const block = (statements: string[]) => {
  return curly(chunk(statements));
};
