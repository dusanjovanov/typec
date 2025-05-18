import { BRANDING_MAP } from "./branding";
import { Param } from "./param";
import { Stat } from "./statement";
import { Type } from "./type";
import type { GenericMembers, PointerQualifier, TypeQualifier } from "./types";
import { Var } from "./variable";

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

  /** Get a union var type for this Union. */
  type(qualifiers?: TypeQualifier[]) {
    return Type.union(this.name, this.members, qualifiers);
  }

  var(name: string, typeQualifiers?: TypeQualifier[]) {
    return Var.new(this.type(typeQualifiers), name);
  }

  /** Pointer Var. */
  pointer(
    name: string,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Var.new(this.type(typeQualifiers).pointer(pointerQualifiers), name);
  }

  /** Param. */
  param<Name extends string>(name: Name, typeQualifiers?: TypeQualifier[]) {
    return Param.new(this.type(typeQualifiers), name);
  }

  /** Pointer param. */
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
