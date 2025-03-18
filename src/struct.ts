import { block } from "./chunk";
import type { Type } from "./type";
import type { CodeLike } from "./types";
import { joinArgs } from "./utils";

/** Used for Struct type declarations. */
export class Struct<Members extends StructMembers> {
  constructor(name: string, members: Members) {
    this.name = name;
    this.members = members;
  }
  name;
  members;

  /** Returns a struct declaration. */
  declare() {
    return `struct ${this.name}${block(
      Object.entries(this.members).map(([name, type]) => `${type} ${name}`)
    )}`;
  }

  /** Returns a struct designated initializer expression. */
  designated(values: StructValuesFromMembers<Members>) {
    return `{ ${joinArgs(
      Object.entries(values).map(([name, value]) => `.${name}=${value}`)
    )} }`;
  }

  static new<Members extends StructMembers>(name: string, members: Members) {
    return new Struct(name, members);
  }
}

export type StructMembers = {
  [Key: string]: Type;
};

export type StructMemberValues = { [key: string]: CodeLike };

export type StructValuesFromMembers<Members extends StructMembers> = {
  [Key in keyof Members]?: CodeLike;
};
