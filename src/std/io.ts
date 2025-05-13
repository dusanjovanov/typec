import { Directive } from "../directive";
import { Func } from "../func";
import { Param } from "../param";
import { Type } from "../type";
import { Value } from "../value";

const FILE = Type.alias("FILE");

export const stdio = {
  include: Directive.includeSystem("stdio.h"),
  FILE,
  size_t: Type.alias("size_t"),
  fpos_t: Type.alias("fpos_t"),
  stdin: Value.macro("stdin"),
  stdout: Value.macro("stdout"),
  stderr: Value.macro("stderr"),
  EOF: Value.macro("EOF"),
  NULL: Value.macro("NULL"),
  FOPEN_MAX: Value.macro("FOPEN_MAX"),
  FILENAME_MAX: Value.macro("FILENAME_MAX"),
  L_tmpnam: Value.macro("L_tmpnam"),
  BUFSIZ: Value.macro("BUFSIZ"),
  TMP_MAX: Value.macro("TMP_MAX"),
  _IOFBF: Value.macro("_IOFBF"),
  _IOLBF: Value.macro("_IOLBF"),
  _IONBF: Value.macro("_IONBF"),
  SEEK_END: Value.macro("SEEK_END"),
  SEEK_SET: Value.macro("SEEK_SET"),
  SEEK_CUR: Value.macro("SEEK_CUR"),
  printf: Func.int(
    "printf",
    [Param.string("format", ["const"], ["const"])],
    undefined,
    {
      hasVarArgs: true,
    }
  ),
  scanf: Func.int(
    "scanf",
    [Param.string("format", ["const"], ["const"])],
    undefined,
    {
      hasVarArgs: true,
    }
  ),
  fprintf: Func.int(
    "fprintf",
    [
      Param.new(FILE.pointer().const(), "stream"),
      Param.string("format", ["const"], ["const"]),
    ],
    undefined,
    {
      hasVarArgs: true,
    }
  ),
  fscanf: Func.int(
    "fscanf",
    [
      Param.new(FILE.pointer().const(), "stream"),
      Param.string("format", ["const"], ["const"]),
    ],
    undefined,
    {
      hasVarArgs: true,
    }
  ),
  sprintf: Func.int(
    "sprintf",
    [Param.string("str"), Param.string("format", ["const"], ["const"])],
    undefined,
    {
      hasVarArgs: true,
    }
  ),
  tmpnam: Func.string("tmpnam", [Param.string("str")]),
  tmpfile: Func.new(FILE.pointer(), "tmpfile", []),
  rename: Func.int("rename", [
    Param.string("oldFilename", ["const"]),
    Param.string("newFilename", ["const"]),
  ]),
  remove: Func.int("rename", [Param.string("filename", ["const"])]),
  fopen: Func.new(FILE, "fopen", [
    Param.string("filename", ["const"]),
    Param.string("_Mode", ["const"]),
  ]),
  fclose: Func.int("fclose", [FILE.pointerParam("stream")]),
  puts: Func.int("puts", [Param.string("str", ["const"])]),
};
