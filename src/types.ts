import type { ArrType } from "./array";
import type { FuncType } from "./func";
import type { Address, PointerType } from "./pointer";
import type { SimpleType, Value } from "./variable";

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
  [Key: string]: SimpleType | ArrType | FuncType | PointerType;
};

export type StructMemberValues = { [key: string]: PassingValue };

export type StructMemberValuesFromMembers<Members extends StructMembers> = {
  [Key in keyof Members]?: TypeValue<Members[Key]>;
};

export type TypeValue<T extends SimpleType | PointerType | ArrType | FuncType> =
  T extends SimpleType<infer S>
    ? Value<S>
    : T extends PointerType<infer S>
    ? Address<S extends SimpleType ? S["specifier"] : S>
    : never;

export type StringLike = string | number;

export type PassingValue = StringLike | Value<any> | Address<any>;
