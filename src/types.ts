import type { Address } from "./address";
import type { ArrayType } from "./array";
import type { Condition } from "./conditional";
import type { FuncType } from "./func";
import type { Pointer } from "./pointer";
import type { Simple } from "./simple";
import type { Value } from "./value";

/** Type union for all simple C types. */
export type SimpleSpecifier =
  | "bool"
  | "char"
  | "signed char"
  | "unsigned char"
  | "short"
  | "unsigned short"
  | "int"
  | "unsigned int"
  | "long"
  | "unsigned long"
  | "long long"
  | "unsigned long long"
  | "float"
  | "double"
  | "long double"
  | "void"
  | "size_t"
  | "wchar_t";

export type TypeQualifier = "const" | "volatile";

export type PointerTypeQualifier = TypeQualifier | "restrict";

/** Helper for loosely typed string unions. You get suggestions, but accepts any string. */
export type Autocomplete<T> = T | (string & {});

export type AutoSimpleSpecifier = Autocomplete<SimpleSpecifier>;

export type StringKeyOf<T extends object> = Extract<keyof T, string>;

/** Extract the Value or Address container type for a data type. */
export type TypeToValueContainer<
  T extends Simple | Pointer | ArrayType | FuncType
> = T extends Simple<infer S>
  ? Value<S>
  : T extends ArrayType | FuncType
  ? Address<T>
  : T extends Pointer<infer K>
  ? Address<K>
  : never;

export type StringLike = string | number;

export type PassingValue = StringLike | Value<any> | Address<any> | Condition;

export class AnyType<S extends string = any> {
  constructor(specifier: S) {
    this.specifier = specifier;
  }
  specifier;
}
