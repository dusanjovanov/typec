import type { Cond } from "./condition";
import type { Enum } from "./enum";
import type { Func } from "./func";
import type { Param } from "./param";
import type { Stat } from "./statement";
import type { Struct } from "./struct";
import type { Switch } from "./switch";
import type { Type } from "./type";
import type { Union } from "./union";
import type { Val, ValStruct, ValUnion } from "./val";

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

export type MemberTypeArg<S extends string = any> =
  | Type<S>
  | Struct<S>
  | Union<S>
  | Enum<S>
  | StructPointer<S>;

export type GenericMembers = {
  [Key: string]: MemberTypeArg;
};

export type GenericEnumValues = Record<string, string | number | null>;

type GenericFunc = {
  hasVarArgs: boolean;
  _params: readonly Param<any, any>[];
  returnType: Type;
} & ((...args: any[]) => any);

export type GenericFuncs = Record<string, GenericFunc>;

export type FuncArgsFromParams<Params extends readonly Param<any, any>[]> = {
  [index in keyof Params]: FuncArg<
    ExtractTypeStr<Params[index]["type"]>,
    Params[index]["name"]
  >;
};

type BoundArgs<Params extends readonly Param<any, any>[]> =
  Params extends readonly [
    infer _ extends Param<any, any>,
    ...infer Rest extends readonly Param<any, any>[]
  ]
    ? FuncArgsFromParams<Rest>
    : [];

export type BoundFunc<F extends GenericFunc> = (
  ...args: F["hasVarArgs"] extends true
    ? [...BoundArgs<F["_params"]>, ...ValArg[]]
    : BoundArgs<F["_params"]>
) => Val<F["returnType"] extends Type<infer S> ? S : any>;

export type BoundFuncs<Funcs extends GenericFuncs> = {
  [key in keyof Funcs]: BoundFunc<Funcs[key]>;
};

export type StructPointer<
  Name extends string = any,
  Members extends GenericMembers = any
> = {
  kind: symbol;
  struct: Struct<Name, Members>;
  members: Members;
};

export type TypeArg<S extends string = any> =
  | Type<S>
  | Struct<S>
  | Union<S>
  | Enum<S>;

export type ValArg =
  | Val
  | Type
  | Struct
  | GenericFunc
  | number
  | string
  | boolean;

/** same as ValArg, but has a generic type and name arguments so that Func call arguments can be "typed" and "named". */
export type FuncArg<_ extends string, __ extends string> =
  | Val
  | Type
  | Struct
  | GenericFunc
  | number
  | string
  | boolean;

export type ValArgWithArray =
  | Val
  | Type
  | Struct
  | GenericFunc
  | number
  | string
  | boolean
  | ValArgWithArray[];

export type StatArg =
  | Stat
  | Val
  | Cond
  | Switch
  | Func<any, any, any>
  | Struct
  | Union
  | Enum;

export type ExtractTypeStr<T extends MemberTypeArg> = T extends Type<infer S>
  ? S
  : T extends Struct<infer Name>
  ? Name
  : T extends Union<infer Name>
  ? Name
  : T extends Enum<infer Name>
  ? Name
  : T extends StructPointer<infer Name>
  ? `${Name}*`
  : any;

export type ParamsListFromParams<Params extends readonly Param<any, any>[]> =
  Params extends []
    ? "void"
    : Params extends readonly [
        infer First extends Param<any, any>,
        ...infer Rest extends readonly Param<any, any>[]
      ]
    ? Rest extends readonly Param<any, any>[]
      ? `${First extends Param<infer T, any>
          ? T
          : any},${ParamsListFromParams<Rest>}`
      : `${First extends Param<infer T, any> ? T : any}`
    : any;

export type FuncParamsByName<Params extends readonly Param<any, any>[]> =
  Params extends []
    ? {}
    : Params extends readonly [
        infer First extends Param<any, any>,
        ...infer Rest extends Param<any, any>[]
      ]
    ? Rest extends readonly Param<any, any>[]
      ? Record<First["name"], First> & FuncParamsByName<Rest>
      : Record<First["name"], First>
    : {};

export type BodyFn<Params extends readonly Param<any, any>[]> = (arg: {
  params: FuncParamsByName<Params>;
}) => StatArg[];

export type FuncArgs<
  Params extends readonly Param<any, any>[],
  VarArgs extends boolean
> = VarArgs extends false
  ? FuncArgsFromParams<Params>
  : [...FuncArgsFromParams<Params>, ...ValArg[]];

export type MemberValues<Members extends GenericMembers> = {
  [Key in keyof Members]: Members[Key] extends Struct<infer N, infer M>
    ? ValStruct<N, M>
    : Members[Key] extends Union<infer N, infer M>
    ? ValUnion<N, M>
    : Members[Key] extends StructPointer<infer N, infer M>
    ? ValStruct<`${N}*`, M>
    : Val<ExtractTypeStr<Members[Key]>>;
};
