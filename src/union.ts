import { BRANDING_MAP } from "./branding";
import { Stat } from "./statement";
import { Type } from "./type";
import type { GenericMembers, PointerQualifier, TypeQualifier } from "./types";

/** Used for declaring and working with unions. */
export class Union<
  Name extends string = any,
  Members extends GenericMembers = any
> {
  constructor(name: Name, members: Members) {
    this.name = name;
    this.members = members;
  }
  kind = BRANDING_MAP.union;
  name;
  members;

  /** Returns the union declaration ( definition ). */
  declare() {
    return Stat.union(this.name, this.members);
  }

  /** Get a type for this union. */
  type(qualifiers?: TypeQualifier[]) {
    return Type.union(this.name, this.members, qualifiers);
  }

  /** Get a pointer type to this union. */
  pointer(
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return this.type(typeQualifiers).pointer(pointerQualifiers);
  }

  /** Create a named union. */
  static new<Name extends string, Members extends GenericMembers>(
    name: Name,
    members: Members
  ) {
    return new Union(name, members);
  }

  /** Create an anonymous Union. */
  static anon<Members extends GenericMembers>(members: Members) {
    return new Union(null as any, members);
  }
}
