import { callFunc } from "./func";
import { includeSys } from "./include";
import type { TextLike } from "./types";
import { argsWithVarArgs } from "./utils";

export const std = {
  printf: (format: string, ...args: TextLike[]) => {
    return callFunc("printf", argsWithVarArgs([format], args));
  },
  includeIo: () => includeSys("stdio.h"),
};
