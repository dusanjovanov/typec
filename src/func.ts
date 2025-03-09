import { block } from "./chunk";
import type { AutocompletedCType, TextLike } from "./types";
import { emptyFalsy } from "./utils";

/** Returns a function prototype statement */
export const funcProto = (
  returnType: AutocompletedCType,
  name: string,
  params: [type: AutocompletedCType, name: string][]
) => `${returnType} ${name}(${params.map((arg) => `${arg[0]} ${arg[1]}`)})`;

/** Returns a function implementation statement */
export const func = (
  returnType: AutocompletedCType,
  name: string,
  params: [type: AutocompletedCType, name: string][],
  body: string[]
) => `${funcProto(returnType, name, params)}${block(body)}`;

/**
 * Returns a function call expression.
 */
export const callFunc = (name: string, args?: TextLike[]) => {
  return `${name}(${emptyFalsy(args, (args) => args.join(","))})`;
};
