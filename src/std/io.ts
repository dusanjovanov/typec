import { Dir } from "../directive";
import { Func } from "../func";
import { Par } from "../param";
import { Val } from "../rValue";
import { Type } from "../type";

const FILE = Type.alias("FILE");

export const stdio = {
  include: Dir.includeSystem("stdio.h"),
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
  printf: Func.int(
    "printf",
    [Par.string("format", ["const"], ["const"])],
    undefined,
    {
      hasVarArgs: true,
    }
  ),
  scanf: Func.int(
    "scanf",
    [Par.string("format", ["const"], ["const"])],
    undefined,
    {
      hasVarArgs: true,
    }
  ),
  fprintf: Func.int(
    "fprintf",
    [
      Par.new(FILE.ptr().const(), "stream"),
      Par.string("format", ["const"], ["const"]),
    ],
    undefined,
    {
      hasVarArgs: true,
    }
  ),
  fscanf: Func.int(
    "fscanf",
    [
      Par.new(FILE.ptr().const(), "stream"),
      Par.string("format", ["const"], ["const"]),
    ],
    undefined,
    {
      hasVarArgs: true,
    }
  ),
  sprintf: Func.int(
    "sprintf",
    [Par.string("str"), Par.string("format", ["const"], ["const"])],
    undefined,
    {
      hasVarArgs: true,
    }
  ),
  tmpnam: Func.string("tmpnam", [Par.string("str")]),
  tmpfile: Func.new(FILE.ptr(), "tmpfile", []),
  rename: Func.int("rename", [
    Par.string("oldFilename", ["const"]),
    Par.string("newFilename", ["const"]),
  ]),
  remove: Func.int("rename", [Par.string("filename", ["const"])]),
  fopen: Func.new(FILE, "fopen", [
    Par.string("filename", ["const"]),
    Par.string("_Mode", ["const"]),
  ]),
  fclose: Func.int("fclose", [Par.new(FILE.ptr(), "stream")]),
  puts: Func.int("puts", [Par.string("str", ["const"])]),
};
