import type { Address } from "./address";
import type { ArrayType } from "./array";
import type { Condition } from "./conditional";
import type { FuncType } from "./func";
import type { Pointer } from "./pointer";
import type { Simple } from "./simple";
import type { Value } from "./value";

/** Type union for all simple C types. */
export type SimpleSpecifier = NumberTypeSpecifier | "bool" | "void";

export type NumberTypeSpecifier =
  | IntegerTypeSpecifier
  | "float"
  | "double"
  | "long double"
  | "wchar_t";

export type IntegerTypeSpecifier =
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
  | "size_t"
  | "ptrdiff_t";

export type TypeQualifier = "const" | "volatile";

export type PointerQualifier = TypeQualifier | "restrict";

/** Helper for loosely typed string unions. You get suggestions, but accepts any string. */
export type Autocomplete<T> = T | (string & {});

export type AutoSimpleSpecifier = Autocomplete<SimpleSpecifier>;

export type StringKeyOf<T extends object> = Extract<keyof T, string>;

/** Extract the Value or Address container type for a data type. */
export type TypeToValueContainer<
  T extends Simple | Pointer | ArrayType | FuncType
> = T extends Simple
  ? Value<T>
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

/** Shortcut type */
export type StringAddress = Address<Simple<"char">>;

export type ArrayIndex = Value<Simple<IntegerTypeSpecifier>>;

export type ComparisonOperatorValue =
  | Value<Simple<NumberTypeSpecifier>>
  | Address<any>;

export type TypeToAddress<T extends Simple | Pointer> = T extends Simple
  ? Address<T>
  : T extends Pointer
  ? PointerToAddress<T>
  : never;

export type PointerToAddress<T extends Pointer> = T extends Pointer<infer K>
  ? Address<K>
  : never;
