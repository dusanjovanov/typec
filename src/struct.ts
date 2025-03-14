import { Address } from "./address";
import type { ArrayType } from "./array";
import { block } from "./chunk";
import type { FuncType } from "./func";
import type { PointerType } from "./pointerType";
import { Simple } from "./simple";
import type { PassingValue, TypeToValueContainer } from "./types";
import { joinArgs } from "./utils";

export class Struct<Members extends StructMembers> {
  constructor(name: string, members: Members) {
    this.type = `struct ${name}`;
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

  /** Returns a struct designated initializer expression. */
  designated(values: StructValuesFromMembers<Members>) {
    return `{ ${joinArgs(
      Object.entries(values).map(([name, value]) => `.${name}=${value}`)
    )} }`;
  }

  /** Returns a struct compound literal expression. */
  compound(values: PassingValue[]) {
    return `{ ${joinArgs(values)} }`;
  }

  static new<Members extends StructMembers>(name: string, members: Members) {
    return new Struct(name, members);
  }
}

export class StructType<Name extends string = any> {
  constructor(name: Name) {
    this.specifier = `struct ${name}`;
  }
  specifier;

  toAddress(value: string) {
    return new Address(this, value);
  }
}

export type StructMembers = {
  [Key: string]: Simple | ArrayType | FuncType | PointerType;
};

export type StructMemberValues = { [key: string]: PassingValue };

export type StructValuesFromMembers<Members extends StructMembers> = {
  [Key in keyof Members]?: TypeToValueContainer<Members[Key]>;
};
