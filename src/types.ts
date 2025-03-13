import type { Address } from "./address";
import type { ArrayType } from "./array";
import type { FuncType } from "./func";
import type { PointerType } from "./pointer";
import type { Simple } from "./simple";
import type { Value } from "./value";

export type SimpleSpecifier =
  | "bool"
  | "char"
  | "signed char"
  | "unsigned char"
  | "short"
  | "unsigned short"
  | "int"
  | "unsigned"
  | "unsigned int"
  | "long"
  | "unsigned long"
  | "long long"
  | "unsigned long long"
  | "float"
  | "double"
  | "long double"
  | "void"
  | "size_t";

export type Autocomplete<T> = T | (string & {});

export type AutoSimpleSpecifier = Autocomplete<SimpleSpecifier>;

export type StringKeyOf<T extends object> = Extract<keyof T, string>;

export type StructMembers = {
  [Key: string]: Simple | ArrayType | FuncType | PointerType;
};

export type StructMemberValues = { [key: string]: PassingValue };

export type StructMemberValuesFromMembers<Members extends StructMembers> = {
  [Key in keyof Members]?: TypeToValue<Members[Key]>;
};

/** Extract the Value or Address container type for a data type. */
export type TypeToValue<T extends Simple | PointerType | ArrayType | FuncType> =
  T extends Simple<infer S>
    ? Value<S>
    : T extends ArrayType | FuncType
    ? Address<T>
    : T extends PointerType<infer S>
    ? Address<S>
    : never;

export type StringLike = string | number;

export type PassingValue = StringLike | Value<any> | Address<any>;

export class AnyType<S extends string = any> {
  constructor(specifier: S) {
    this.specifier = specifier;
  }
  specifier;
}
