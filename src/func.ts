import { block } from "./chunk";
import type { AutocompletedCType, TextLike } from "./types";
import { emptyFalsy } from "./utils";

export const funcProto = (
  returnType: AutocompletedCType,
  name: string,
  params: [type: AutocompletedCType, name: string][]
) => `${returnType} ${name}(${params.map((arg) => `${arg[0]} ${arg[1]}`)})`;

export const func = (
  returnType: AutocompletedCType,
  name: string,
  params: [type: AutocompletedCType, name: string][],
  body: string[]
) => `${funcProto(returnType, name, params)}${block(body)}`;

export const callFunc = (name: string, args?: TextLike[]) => {
  return `${name}(${emptyFalsy(args, (args) => args.join(","))})`;
};
