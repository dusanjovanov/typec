import { Param } from "./param";
import { Type } from "./type";
import type { Members, PointerQualifier, TypeQualifier } from "./types";
import { Var } from "./variable";

/** Used for declaring and working with unions. */
export class Union {
  constructor(members: Members, name: string | null = null) {
    this.name = name;
    this.members = members;
  }
  name;
  members;

  /** Returns the union declaration ( definition ). */
  declare() {
    return `union ${this.name}${Type.membersBlock(this.members)};`;
  }

  /** Get a union var type for this Union. */
  type(qualifiers?: TypeQualifier[]) {
    return Type.union(this.name, this.members, qualifiers);
  }

  var(name: string, typeQualifiers?: TypeQualifier[]) {
    return Var.new(this.type(typeQualifiers), name);
  }

  pointer(
    name: string,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Var.new(this.type(typeQualifiers).pointer(pointerQualifiers), name);
  }

  param<Name extends string>(name: Name, typeQualifiers?: TypeQualifier[]) {
    return Param.new(this.type(typeQualifiers), name);
  }

  pointerParam<Name extends string>(
    name: Name,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Param.new(
      this.type(typeQualifiers).pointer(pointerQualifiers),
      name
    );
  }

  /** Create a named union. */
  static new(name: string, members: Members) {
    return new Union(members, name);
  }

  /** Create an anonymous Union. */
  static anon(members: Members) {
    return new Union(members);
  }
}
