import { block } from "./chunk";
import { Type } from "./type";
import type {
  StringLike,
  StructMembers,
  StructMemberValuesFromMembers,
} from "./types";
import { joinArgs } from "./utils";

export class Struct<Members extends StructMembers> {
  constructor(name: string, members: Members) {
    this.type = Type.struct(name);
    this.name = name;
    this.members = members;
  }
  type;
  name;
  members;

  /** Returns a struct declaration. */
  declare() {
    return `${this.type}${block(
      Object.entries(this.members).map(([name, type]) => `${type} ${name}`)
    )}`;
  }

  /** Returns a struct compound literal expression. */
  literal(values: StructMemberValuesFromMembers<Members>) {
    return `{ ${joinArgs(
      Object.entries(values).map(([name, value]) => `.${name}=${value}`)
    )} }`;
  }

  /** Returns a struct literal expression. */
  literalSeq(values: StringLike[]) {
    return `{ ${joinArgs(values)} }`;
  }
}

export const struct = <Members extends StructMembers>(
  name: string,
  members: Members
) => {
  return new Struct(name, members);
};
