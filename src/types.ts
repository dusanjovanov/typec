import type { Cond } from "./condition";
import type { Enum } from "./enum";
import type { Func } from "./func";
import type { Param } from "./param";
import type { Stat } from "./statement";
import type { Struct } from "./struct";
import type { Switch } from "./switch";
import type { Type } from "./type";
import type { Union } from "./union";
import type { Val } from "./val";

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
  "int8_t",
  "int16_t",
  "int32_t",
  "int64_t",
  "uint8_t",
  "uint16_t",
  "uint32_t",
  "uint64_t",
  "int_least8_t",
  "int_least16_t",
  "int_least32_t",
  "int_least64_t",
  "uint_least8_t",
  "uint_least16_t",
  "uint_least32_t",
  "uint_least64_t",
  "int_fast8_t",
  "int_fast16_t",
  "int_fast32_t",
  "int_fast64_t",
  "uint_fast8_t",
  "uint_fast16_t",
  "uint_fast32_t",
  "uint_fast64_t",
  "intmax_t",
  "uintmax_t",
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

export type TypeQualifier = "const" | "volatile" | "static" | "inline";

export type PointerQualifier = TypeQualifier | "restrict";

/** Helper for loosely typed string unions. You get suggestions, but accepts any string. */
export type Autocomplete<T> = T | (string & {});

export type AutoSimpleType = Autocomplete<SimpleType>;

export type StringKeyOf<T extends object> = Extract<keyof T, string>;

export type TextLike = string | number | boolean;

export type Numberish = number | string;

/** `string`, `number`, `boolean`, or a tc object with `toString()` implemented. */
export type CodeLike = TextLike | { toString(): string };

export type GenericMembers = {
  [Key: string]: Type<any>;
};

export type GenericEnumValues = Record<string, string | number | null>;

export type FuncArgsFromParams<Params extends readonly Param<any, any>[]> = {
  [index in keyof Params]: FuncArg<
    Params[index]["type"] extends Type<infer S> ? S : any,
    Params[index]["name"]
  >;
};

export type GenericFunc = Func<any, any>;
export type GenericApi = Record<string, GenericFunc>;

export type BoundFunc<Fn extends GenericFunc> = (
  ...args: Fn["hasVarArgs"] extends false
    ? BoundArgs<Fn["_params"]>
    : [...BoundArgs<Fn["_params"]>, ...CodeLike[]]
) => Val<Fn extends Func<infer R, any, any> ? R : any>;

export type BoundFuncs<Funcs extends GenericApi> = {
  [key in keyof Funcs]: BoundFunc<Funcs[key]>;
};

type BoundArgs<Params extends readonly Param<any, any>[]> =
  Params extends readonly [
    infer _ extends Param<any, any>,
    ...infer Rest extends readonly Param<any, any>[]
  ]
    ? FuncArgsFromParams<Rest>
    : [];

export type TypeArg<S extends string = any> =
  | Type<S>
  | Struct<S>
  | Union<S>
  | Enum<S>
  | Func<S, any, any>;

export type ValArg =
  | Val
  | Type
  | Struct
  | Func<any, any, any>
  | number
  | string
  | boolean;

/** same as ValArg, but has a generic type and name arguments so that Func call arguments can be "typed" and "named". */
export type FuncArg<_ extends string, __ extends string> =
  | Val
  | Type
  | Struct
  | Func<any, any, any>
  | number
  | string
  | boolean;

export type StatArg =
  | Stat
  | Val
  | Cond
  | Switch
  | Func<any, any, any>
  | Struct
  | Union
  | Enum;
