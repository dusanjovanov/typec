import { block } from "./chunk";
import { Simple } from "./simple";
import type {
  PassingValue,
  StructMembers,
  StructMemberValuesFromMembers,
} from "./types";
import { joinArgs } from "./utils";
import { Value } from "./value";

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
  designated(values: StructMemberValuesFromMembers<Members>) {
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
    this.specifier = `struct ${name}` as const;
  }
  specifier;
}

const s = Struct.new("Person", { a: Simple.type("int") });

s.designated({ a: Value.int(3) });
