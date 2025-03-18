import type { ArrayType } from "./array";
import { block } from "./chunk";
import type { FuncType } from "./func";
import { Pointer } from "./pointer";
import { Simple } from "./simple";
import type { CodeLike, PointerQualifier } from "./types";
import { joinArgs } from "./utils";
import type { Value } from "./value";

/** Used for Struct declarations. */
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

  static type<Name extends string = any>(name: Name) {
    return new StructType(name);
  }

  static new<Members extends StructMembers>(name: string, members: Members) {
    return new Struct(name, members);
  }
}

/** Type of a struct instance. */
export class StructType<Name extends string = any> {
  constructor(name: Name) {
    this.full = `struct ${name}`;
  }
  full;

  /** Create a pointer type for this function type. */
  pointer(pointerQualifiers?: PointerQualifier[]) {
    // return Pointer.type(this, pointerQualifiers);
  }

  static new<Name extends string = any>(name: Name) {
    return new StructType(name);
  }
}

export type StructMembers = {
  [Key: string]: Simple | ArrayType | FuncType | StructType | Pointer;
};

export type StructMemberValues = { [key: string]: CodeLike };

export type StructValuesFromMembers<Members extends StructMembers> = {
  // [Key in keyof Members]?: Value<Members[Key]>;
};
