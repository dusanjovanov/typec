import type { Enum } from "./enum";
import type { Func } from "./func";
import type { Par } from "./param";
import type { Struct } from "./struct";
import type { Type } from "./type";
import type { Union } from "./union";
import type { Val } from "./value";

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

/** same as CodeLike, but has a generic string argument so that Func call arguments can be "named". */
export type FuncArg<_ extends string> = TextLike | { toString(): string };

export type GenericMembers = {
  [Key: string]: Type<any>;
};

export type FuncArgsFromParams<Params extends readonly Par<any, any>[]> = {
  [index in keyof Params]: FuncArg<Params[index]["name"]>;
};

export type GenericFunc = Func<any, any>;
export type GenericApi = Record<string, GenericFunc>;

export type BoundFunc<Func extends GenericFunc> = (
  ...args: Func["hasVarArgs"] extends false
    ? BoundArgs<Func["_params"]>
    : [...BoundArgs<Func["_params"]>, ...CodeLike[]]
) => Val<"any">;

export type BoundApi<Funcs extends GenericApi> = {
  [key in keyof Funcs]: BoundFunc<Funcs[key]>;
};

type BoundArgs<Params extends readonly Par<any, any>[]> =
  Params extends readonly [
    infer _ extends Par<any, any>,
    ...infer Rest extends readonly Par<any, any>[]
  ]
    ? FuncArgsFromParams<Rest>
    : [];

export type TypeArg<S extends string = any> =
  | Type<S>
  | Struct<S, any>
  | Union<S, any>
  | Enum<S, any>;
