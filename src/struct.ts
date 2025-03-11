import { block } from "./chunk";
import { assign } from "./operators";
import { pointer } from "./pointer";
import { Type } from "./type";
import type {
  AutoPointerQualifier,
  AutoQualifier,
  StringKeyOf,
  StringLike,
  StructMembers,
  StructMemberValuesFromMembers,
} from "./types";
import { joinArgs } from "./utils";
import { variable } from "./variable";

export const struct = <Members extends StructMembers>(
  name: string,
  members: Members
) => {
  const type = Type.struct(name);

  const literal = (values: StructMemberValuesFromMembers<Members>) => {
    return `{ ${joinArgs(
      Object.entries(values).map(([name, value]) => `.${name}=${value}`)
    )} }`;
  };

  const literalSeq = (values: StringLike[]) => {
    return `{ ${joinArgs(values)} }`;
  };

  return {
    name,
    members,
    type,
    declare: () => {
      return `${type}${block(
        Object.entries(members).map(([name, type]) => `${type} ${name}`)
      )}`;
    },
    literal,
    literalSeq,
    /** Create a variable to hold an instance of the struct */
    variable: (name: string, qualifier?: AutoQualifier) => {
      const varType = Type.var(type, qualifier);

      const structVar = variable(varType, name);

      const declaration = structVar.declare();

      return {
        ...structVar,
        initStructVal: (values: StructMemberValuesFromMembers<Members>) => {
          return assign(declaration, literal(values));
        },
        initStructSeq: (values: StringLike[]) => {
          return assign(declaration, literalSeq(values));
        },
        assignStructVal: (values: StructMemberValuesFromMembers<Members>) => {
          return assign(name, literal(values));
        },
        assignStructSeq: (values: StringLike[]) => {
          return assign(name, literalSeq(values));
        },
        byValue: (member: StringKeyOf<Members>) => {
          return `${name}.${member}`;
        },
        /** Create a pointer to a struct instance */
        pointer: (name: string, qualifer?: AutoPointerQualifier) => {
          const pointerType = Type.pointer(varType, qualifer);
          const declaration = `${pointerType} ${name}`;

          return {
            ...pointer(pointerType, name),
            declare: () => declaration,
            assignStructVarAddr: () => assign(name, structVar.addr()),
            initStructVarAddr: () => assign(declaration, structVar.addr()),
            byAddress: (member: StringKeyOf<Members>) => {
              return `${name}->${member}`;
            },
          };
        },
      };
    },
  };
};
