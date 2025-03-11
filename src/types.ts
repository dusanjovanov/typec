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

export type Variable = {
  name: string;
  type: string;
  declare: () => string;
  addr: () => string;
  assignVar: (name: string) => string;
  assignValue: (value: StringLike) => string;
  variable: (name: string) => VariableVariable;
  pointer: (name: string) => VariablePointer;
};

export type VariableVariable = Variable & {
  initPrevValue: () => string;
  assignPrevValue: () => string;
};

export type VariablePointer = Pointer & {
  initPrevAddr: () => string;
  assignPrevAddr: () => string;
};

export type Pointer = {
  name: string;
  type: string;
  declare: () => string;
  value: () => string;
  addr: () => string;
  assignPointer: (name: string) => string;
  assignAddr: (address: string) => string;
  variable: (name: string) => PointerVariable;
  pointer: (name: string) => PointerPointer;
};

export type PointerVariable = Variable & {
  initPrevValue: () => string;
  assignPrevValue: () => string;
};

export type PointerPointer = Pointer & {
  initPrevAddr: () => string;
  assignPrevAddr: () => string;
};

type BaseParam = {
  name: string;
  type: string;
  addr: () => string;
  declare: () => string;
};

export type FuncValueParam = BaseParam & {
  kind: "param";
};

export type FuncPointerParam = BaseParam &
  Pointer & {
    kind: "pointerParam";
  };

export type FuncVarArgsParam = {
  kind: "varArgs";
  type: "...";
  declare: () => string;
};

export type FuncParam = FuncValueParam | FuncPointerParam | FuncVarArgsParam;

export type FuncParams =
  | [FuncValueParam | FuncPointerParam, ...FuncParam[]]
  | [];

export type Func = {
  returnType: string;
  name: string;
  params: FuncParams;
  paramTypes: string[];
  addr: () => string;
  declare: () => string;
  define: () => string;
  call: (args?: StringLike[]) => string;
  callVarArgs: (startArgs: StringLike[], varArgs: StringLike[]) => string;
  return: (value: StringLike) => string;
  varReturn: (name: string) => FuncVariableReturn;
  pointerReturn: (name: string) => FuncPointerReturn;
  pointerFunc: (name: string) => FuncPointerFunc;
};

export type FuncVariableReturn = Variable & {
  initReturn: (args?: StringLike[]) => string;
  assignReturn: (args?: StringLike[]) => string;
};

export type FuncPointerReturn = Pointer & {
  initReturn: (args?: StringLike[]) => string;
  assignReturn: (args?: StringLike[]) => string;
};

export type FuncPointerFunc = Pointer & {
  initFuncAddr: () => string;
  assignFuncAddr: () => string;
};
