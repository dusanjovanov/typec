import type { Param, PointerParam, VarArgsParam } from "./func";

export type TypeSpecifier =
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
  | "void";

export type Qualifier =
  | "const"
  | "static const"
  | "volatile"
  | "static"
  | "register"
  | "auto"
  | "extern";

export type PointerQualifier = Qualifier | "restricted";

export type Autocomplete<T extends string> = T | (string & {});

export type StringLike = string | number;

export type AutoSpecifier = Autocomplete<TypeSpecifier>;

export type AutoQualifier = Autocomplete<Qualifier>;

export type AutoPointerQualifier = Autocomplete<PointerQualifier>;

export type StringKeyOf<T extends object> = Extract<keyof T, string>;

export type StructMembers = { [key: string]: AutoSpecifier };

export type StructMemberValues = { [key: string]: StringLike };

export type StructMemberValuesFromMembers<Members extends StructMembers> = {
  [key in keyof Members]?: StringLike;
};

export type FuncParam = Param | PointerParam | VarArgsParam;

export type FuncParams = [Param | PointerParam, ...FuncParam[]] | [];
