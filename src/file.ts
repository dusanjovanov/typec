import { isWhich } from "./brand";
import { Stat } from "./statement";
import type { FilePart } from "./types";

/** Helper for generating a .c file code. */
export class TcFile {
  constructor(parts: FilePart[]) {
    this.parts = parts;
  }
  parts;

  static new(parts: FilePart[]) {
    return new TcFile(parts);
  }

  toString() {
    return Stat.chunk(
      this.parts
        .map((p) => {
          if (isWhich("cls", p)) {
            return p.embed.map((e: any) => Stat.statArgToStat(e));
          }
          return p;
        })
        .flat(Infinity as 1)
    );
  }
}
