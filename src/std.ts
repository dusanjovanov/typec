import { argsWithVarArgs, call } from "./func";
import { includeSys } from "./include";
import type { StringLike } from "./types";

export const std = {
  includeIo: () => includeSys("stdio.h"),
  printf: (format: string, ...args: StringLike[]) => {
    return call("printf", argsWithVarArgs([format], args));
  },
  /** stdlib */
  includeLib: () => includeSys("stdlib.h"),
  /** C++ stdlib */
  includeCLib: () => includeSys("cstdlib.h"),
  malloc: (size: string) => call("malloc", [size]),
  calloc: (count: StringLike, size: string) => call("calloc", [count, size]),
  realloc: (block: string, size: string) => call("realloc", [block, size]),
  free: (block: string) => call("free", [block]),
};
