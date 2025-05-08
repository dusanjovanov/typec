import { Block } from "./chunk";
import { Type } from "./type";
import type { GenericMembers, PointerQualifier, TypeQualifier } from "./types";

export class Union<Members extends GenericMembers = any> {
  constructor(members: Members, name: string | null = null) {
    this.name = name;
    this.members = members;
  }
  name;
  members;

  /** Returns the union declaration ( definition ). */
  declare() {
    return `union ${this.name}${Block.new(
      Object.entries(this.members).map(([name, type]) => `${type} ${name}`)
    )};`;
  }

  /** Get a union var type for this Union. */
  type(qualifiers?: TypeQualifier[]) {
    return Type.union(this.name, qualifiers);
  }

  /** Get a union pointer var type for this Union. */
  pointerType(
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Type.unionPointer(this.name, typeQualifiers, pointerQualifiers);
  }

  /** Create a named union. */
  static new<Members extends GenericMembers>(name: string, members: Members) {
    return new Union(members, name);
  }

  /** Create an anonymous Union. */
  static anon<Members extends GenericMembers>(members: Members) {
    return new Union(members);
  }
}
