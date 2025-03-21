import type { Array } from "./array";
import type { Block, Chunk } from "./chunk";
import type { Condition } from "./condition";
import type { RValue } from "./rValue";
import type { StructVar } from "./structVar";
import type { Type } from "./type";

export const INTEGER_TYPES = [
  "char",
  "signed char",
  "unsigned char",
  "short",
  "unsigned short",
  "int",
  "unsigned int",
  "long",
  "unsigned long",
  "long long",
  "unsigned long long",
  "size_t",
  "ptrdiff_t",
] as const;

export const NUMBER_TYPES = [
  ...INTEGER_TYPES,
  "float",
  "double",
  "long double",
  "wchar_t",
] as const;

/** Type union for all simple C types. */
export type SimpleType = NumberType | "bool" | "void";

export type NumberType = (typeof NUMBER_TYPES)[number];

export type IntegerType = (typeof INTEGER_TYPES)[number];

export type TypeQualifier = "const" | "volatile";

export type PointerQualifier = TypeQualifier | "restrict";

/** Helper for loosely typed string unions. You get suggestions, but accepts any string. */
export type Autocomplete<T> = T | (string & {});

export type AutoSimpleType = Autocomplete<SimpleType>;

export type StringKeyOf<T extends object> = Extract<keyof T, string>;

export type TextLike = string | number;

/** `string`, `number` or a typec object with `toString()` implemented. */
export type CodeLike =
  | TextLike
  | null
  | Chunk
  | Block
  | RValue
  | Condition
  | StructVar
  | Array
  | Type;

export type StructMembers = {
  [Key: string]: Type;
};

export type StructDesignatedInitValues<Members extends StructMembers> = {
  [Key in keyof Members]?: CodeLike;
};
