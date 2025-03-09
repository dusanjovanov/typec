/** #include "" */
export const includeRel = (name: string) => `#include "${name}"`;

/** #include <> */
export const includeSys = (name: string) => `#include <${name}>`;
