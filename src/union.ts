import { Block } from "./chunk";
import { Type } from "./type";
import type { GenericMembers, PointerQualifier, TypeQualifier } from "./types";
import { UnionVar } from "./unionVar";

export class Union<Members extends GenericMembers = any> {
  constructor(name: string, members: Members) {
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

  /** Returns a UnionVar to hold an instance of this Union. */
  var(name: string, qualifiers?: TypeQualifier[]) {
    return UnionVar.new(this.type(qualifiers), name, this.members);
  }

  /** Returns a UnionVar to hold a `pointer` to an instance of this Union. */
  pointer(
    name: string,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return UnionVar.new(
      this.pointerType(typeQualifiers, pointerQualifiers),
      name,
      this.members
    );
  }

  static new<Members extends GenericMembers>(name: string, members: Members) {
    return new Union(name, members);
  }
}
