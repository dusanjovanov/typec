import { block } from "./chunk";
import { assign, ref } from "./operators";
import type { AutocompletedCType, StringKeyOf, StringLike } from "./types";
import { join } from "./utils";

export const byValue = (struct: string, member: string) => {
  return `${struct}.${member}`;
};

export const byRef = (structPointer: string, member: string) => {
  return `${structPointer}->${member}`;
};

export const structType = (name: string) => `struct ${name}`;

export const structDeclare = <Members extends StructMembers>(
  name: string,
  members: Members
) => {
  return `struct ${name}${block(
    Object.entries(members).map(([name, type]) => `${type} ${name}`)
  )}`;
};

export const structVarInitValue = (memberValues: StructMemberValues) => {
  return `{ ${join(
    Object.entries(memberValues).map(([name, value]) => `.${name}=${value}`),
    ","
  )} }`;
};

export const structInitSeqValue = (values: StringLike[]) => {
  return `{ ${join(values, ",")} }`;
};

export const structVarDeclare = (structName: string, name: string) => {
  return `${structType(structName)} ${name}`;
};

export const structVarInit = (
  structName: string,
  name: string,
  memberValues: StructMemberValues
) => {
  return assign(
    structVarDeclare(structName, name),
    structVarInitValue(memberValues)
  );
};

export const structVarInitSeq = (
  structName: string,
  name: string,
  values: StringLike[]
) => {
  return assign(structVarDeclare(structName, name), structInitSeqValue(values));
};

export const structPointer =() => {
  return {
    //
  }
}

export const struct = <Members extends StructMembers>(
  name: string,
  members: Members
) => {
  const type = structType(name);

  return {
    declare: structDeclare(name, members),
    varDeclare: (varName: string) => structVarDeclare(name, varName),
    varInit: (
      varName: string,
      memberValues: StructMemberValuesFromMembers<Members>
    ) => {
      return structVarInit(name, varName, memberValues);
    },
    varInitSeq: (varName: string, values: StringLike[]) => {
      return structVarInitSeq(name, varName, values);
    },
    ref: ref(name),
    type,
    byPointer: (key: StringKeyOf<Members>) => byRef(name, key),
    byValue: (key: StringKeyOf<Members>) => byValue(name, key),
    pointer: (pointerName: string) => {
      return;
    },
  };
};

type StructMembers = { [key: string]: AutocompletedCType };
type StructMemberValues = { [key: string]: StringLike };

type StructMemberValuesFromMembers<Members extends StructMembers> = {
  [key in keyof Members]: StringLike;
};
