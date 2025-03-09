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

export const curly = (chunk: string) => {
  return `\n{\n${chunk}\n}`;
};

export const block = (statements: string[]) => {
  return curly(chunk(statements));
};
