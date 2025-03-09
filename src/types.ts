export type CType =
  | "int"
  | "void"
  | "short"
  | "long"
  | "long long"
  | "float"
  | "signed"
  | "unsigned"
  | "char"
  | "char*";

export type Autocomplete<T extends string> = T | (string & {});

export type TextLike = string | number;

export type Condition = TextLike;

export type AutocompletedCType = Autocomplete<CType>;
