import type { Cond } from "./condition";
import type { Enum } from "./enum";
import type { Func } from "./func";
import type { Stat } from "./statement";
import type { Struct } from "./struct";
import type { Switch } from "./switch";
import type { Type } from "./type";
import type { StructPointer } from "./types";
import type { Union } from "./union";
import { isTcObject } from "./utils";
import type { Val } from "./val";

export const BRANDING_MAP = {
  stat: Symbol.for("tc_stat"),
  struct: Symbol.for("tc_struct"),
  union: Symbol.for("tc_union"),
  enum: Symbol.for("tc_enum"),
  func: Symbol.for("tc_func"),
  val: Symbol.for("tc_val"),
  switch: Symbol.for("tc_switch"),
  cond: Symbol.for("tc_cond"),
  type: Symbol.for("tc_type"),
  structPointer: Symbol.for("tc_structPointer"),
};

export const isWhich = <Which extends keyof BrandingMap>(
  which: Which,
  val: any
): val is BrandingMap[Which] => {
  return isTcObject(val) && val.kind === BRANDING_MAP[which];
};

export type BrandingMap = {
  stat: Stat;
  struct: Struct;
  union: Union;
  func: Func<any, any, any>;
  switch: Switch;
  cond: Cond;
  enum: Enum;
  val: Val;
  type: Type;
  structPointer: StructPointer;
};
