import { block } from "./chunk";
import { assign } from "./operators";
import { createPointer } from "./pointer";
import { Type } from "./type";
import type {
  AutoPointerQualifier,
  AutoQualifier,
  StringKeyOf,
  StringLike,
  StructMembers,
  StructMemberValuesFromMembers,
} from "./types";
import { join } from "./utils";
import { createVar } from "./variable";

export const struct = <Members extends StructMembers>(
  name: string,
  members: Members
) => {
  const type = `struct ${name}`;

  const literal = (values: StructMemberValuesFromMembers<Members>) => {
    return `{ ${join(
      Object.entries(values).map(([name, value]) => `.${name}=${value}`),
      ","
    )} }`;
  };

  const literalSeq = (values: StringLike[]) => {
    return `{ ${join(values, ",")} }`;
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
    var: (name: string, qualifier?: AutoQualifier) => {
      const varType = Type.var(type, qualifier);
      const declaration = `${varType} ${name}`;

      const structVar = createVar(varType, name);

      return {
        ...structVar,
        declare: () => declaration,
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
        pointer: (name: string, qualifer?: AutoPointerQualifier) => {
          const pointerType = Type.pointer(varType, qualifer);
          const declaration = `${pointerType} ${name}`;

          return {
            ...createPointer(pointerType, name),
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
