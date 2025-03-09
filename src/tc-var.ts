import type { AutocompletedCType, TextLike } from "./types";
import { emptyFalsy, join } from "./utils";

export const _var = (
  type: AutocompletedCType,
  name: string,
  assign?: TextLike
) => {
  return `${type} ${name}${emptyFalsy(assign, (s) => ` = ${s}`)}`;
};

export const arrVar = (type: AutocompletedCType, name: string, len: number) => {
  return _var(type, `${name}[${len}]`);
};

export const arrInit = (
  type: AutocompletedCType,
  name: string,
  values: TextLike[]
) => {
  return _var(type, `${name}[]`, `{${join(values, ",")}}`);
};
