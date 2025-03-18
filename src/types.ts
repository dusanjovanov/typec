import type { ArrayType } from "./array";
import type { FuncType } from "./func";
import type { Pointer } from "./pointer";
import type { Simple } from "./simple";
import type { StructType } from "./struct";
import type { Value } from "./value";
import type { Variable } from "./variable";

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
export type CodeLike = TextLike | { toString: () => string };

export class AnyType<S extends string = any> {
  constructor(specifier: S) {
    this.specifier = specifier;
  }
  specifier;
}

export type NumberValue = Value<Simple<NumberType>>;

export type IntegerValue = Value<Simple<IntegerType>>;

export type PointerDiffValue = Value<Simple<"ptrdiff_t">>;

export type NullValue = Value<Pointer<Simple<"void">>>;

export type StringValue = Value<Pointer<Simple<"char">>>;

export type ArrayIndexType = Simple<IntegerType>;

export type ArrayIndexValue = Value<ArrayIndexType>;

export type InvalidValue = Value<never>;

export type TypecType = Simple | Pointer | ArrayType | FuncType | StructType;

export type AssignValue<T extends Simple | Pointer> = Value<T> | Variable<T>;

export type AssignNumberValue = AssignValue<Simple<NumberType>>;

export type AssignIntegerValue = AssignValue<Simple<IntegerType>>;

export type AssignArrayIndexValue = AssignValue<Simple<IntegerType>>;

export type AssignPointerNumberValue = AssignValue<Pointer<Simple<NumberType>>>;
