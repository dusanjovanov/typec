import { Directive } from "../directive";
import { Fn } from "../func";
import { Param } from "../param";
import { Val } from "../val";
import { Type } from "../type";

const FILE = Type.alias("FILE");

export const stdio = {
  include: Directive.includeSys("stdio.h"),
  FILE,
  size_t: Type.alias("size_t"),
  fpos_t: Type.alias("fpos_t"),
  stdin: Val.macro("stdin"),
  stdout: Val.macro("stdout"),
  stderr: Val.macro("stderr"),
  EOF: Val.macro("EOF"),
  NULL: Val.macro("NULL"),
  FOPEN_MAX: Val.macro("FOPEN_MAX"),
  FILENAME_MAX: Val.macro("FILENAME_MAX"),
  L_tmpnam: Val.macro("L_tmpnam"),
  BUFSIZ: Val.macro("BUFSIZ"),
  TMP_MAX: Val.macro("TMP_MAX"),
  _IOFBF: Val.macro("_IOFBF"),
  _IOLBF: Val.macro("_IOLBF"),
  _IONBF: Val.macro("_IONBF"),
  SEEK_END: Val.macro("SEEK_END"),
  SEEK_SET: Val.macro("SEEK_SET"),
  SEEK_CUR: Val.macro("SEEK_CUR"),
  printf: Fn.int(
    "printf",
    [Param.string("format", ["const"], ["const"])],
    undefined,
    {
      hasVarArgs: true,
    }
  ),
  scanf: Fn.int(
    "scanf",
    [Param.string("format", ["const"], ["const"])],
    undefined,
    {
      hasVarArgs: true,
    }
  ),
  fprintf: Fn.int(
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
  fscanf: Fn.int(
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
  sprintf: Fn.int(
    "sprintf",
    [Param.string("str"), Param.string("format", ["const"], ["const"])],
    undefined,
    {
      hasVarArgs: true,
    }
  ),
  tmpnam: Fn.string("tmpnam", [Param.string("str")]),
  tmpfile: Fn.new(FILE.pointer(), "tmpfile", []),
  rename: Fn.int("rename", [
    Param.string("oldFilename", ["const"]),
    Param.string("newFilename", ["const"]),
  ]),
  remove: Fn.int("rename", [Param.string("filename", ["const"])]),
  fopen: Fn.new(FILE, "fopen", [
    Param.string("filename", ["const"]),
    Param.string("_Mode", ["const"]),
  ]),
  fclose: Fn.int("fclose", [Param.new(FILE.pointer(), "stream")]),
  puts: Fn.int("puts", [Param.string("str", ["const"])]),
};
