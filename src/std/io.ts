import { Func } from "../func";
import { Include } from "../include";
import { lib } from "../lib";
import { Param } from "../param";
import { Type } from "../type";

export const stdio = lib({
  externals: [
    {
      include: Include.system("stdio.h"),
      api: {
        printf: Func.new(
          Type.int(),
          "printf",
          [Param.string("_Format")],
          undefined,
          {
            hasVarArgs: true,
          }
        ),
        puts: Func.new(Type.int(), "puts", [
          Param.string("_Buffer", ["const"]),
        ]),
      },
    },
  ],
});
