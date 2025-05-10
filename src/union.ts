import { Block } from "./chunk";
import { Type } from "./type";
import type { GenericMembers, PointerQualifier, TypeQualifier } from "./types";

/** Used for declaring and working with unions. */
export class Union<Members extends GenericMembers = any> {
  constructor(members: Members, name: string | null = null) {
    this.name = name;
    this.members = members;
  }
  name;
  members;

  /** Returns the union declaration ( definition ). */
  declare() {
    return `union ${this.name}${Union.membersBlock(this.members)};`;
  }

  /** Get a union var type for this Union. */
  type(qualifiers?: TypeQualifier[]) {
    return Type.union(this.name, this.members, qualifiers);
  }

  /** Get a union pointer var type for this Union. */
  pointerType(
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Type.unionPointer(
      this.name,
      this.members,
      typeQualifiers,
      pointerQualifiers
    );
  }

  /** Generates a block of union members. */
  static membersBlock(members: GenericMembers) {
    return Block.new(
      ...Object.entries(members).map(([name, type]) => `${type} ${name}`)
    );
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
