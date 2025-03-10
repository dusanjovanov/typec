export type CType =
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

export type Autocomplete<T extends string> = T | (string & {});

export type StringLike = string | number;

export type AutocompletedCType = Autocomplete<CType>;

export type StringKeyOf<T extends object> = Extract<keyof T, string>;

export type FuncParamType = AutocompletedCType;
export type FuncReturn = AutocompletedCType;
export type FuncParam = [type: FuncParamType, name: string];
