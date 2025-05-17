import { Param } from "./param";
import { Type } from "./type";
import type {
  Embeddable,
  GenericMembers,
  PointerQualifier,
  TypeQualifier,
} from "./types";
import { Var } from "./variable";

/** Used for declaring and working with unions. */
export class Union<Name extends string, Members extends GenericMembers>
  implements Embeddable
{
  constructor(name: Name, members: Members) {
    this.name = name;
    this.members = members;
  }
  kind = "union" as const;
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

  /** Pointer Var. */
  pointer(
    name: string,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Var.new(this.type(typeQualifiers).pointer(pointerQualifiers), name);
  }

  /** Param. */
  par<Name extends string>(name: Name, typeQualifiers?: TypeQualifier[]) {
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

  embed() {
    return this.declare();
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
