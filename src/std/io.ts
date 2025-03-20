import { Func } from "../func";
import { Include } from "../include";
import { Param } from "../param";
import { Type } from "../type";

export class StdIo {
  static include() {
    return Include.system("stdio.h");
  }

  static printf = Func.new(
    Type.int(),
    "printf",
    [Param.string("_Format")],
    undefined,
    {
      hasVarArgs: true,
    }
  );

  static puts = Func.new(Type.int(), "puts", [
    Param.string("_Buffer", ["const"]),
  ]);
}
