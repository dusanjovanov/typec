import { BRANDING_MAP } from "./brand";
import { Stat } from "./statement";
import { Type } from "./type";
import type {
  GenericMembers,
  PointerQualifier,
  StructPointer,
  TypeQualifier,
} from "./types";
import { Val } from "./val";

/** Used for declaring and working with structs. */
export class Struct<
  Name extends string = any,
  Members extends GenericMembers = any
> {
  constructor(members: Members, name: Name = null as unknown as Name) {
    this.name = name;
    this.members = members;
  }
  kind = BRANDING_MAP.struct;
  name;
  members;

  /** Returns the struct declaration statement. */
  declare() {
    return Stat.struct(this.name, this.members);
  }

  /** Get a type for this struct. */
  type(qualifiers?: TypeQualifier[]) {
    return Type.struct<Name>(this.name, qualifiers);
  }

  /** Get a pointer type to this struct. */
  pointer(
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return this.type(typeQualifiers).pointer(pointerQualifiers);
  }

  /** Helper for defining nested pointers to structs. */
  structPointer(): StructPointer<Name, Members> {
    return {
      kind: BRANDING_MAP.structPointer,
      struct: this,
      members: this.members,
    };
  }

  sizeOf() {
    return Val.sizeOf(this);
  }

  alignOf() {
    return Val.alignOf(this);
  }

  static new<Name extends string, Members extends GenericMembers>(
    name: Name,
    members: Members
  ) {
    return new Struct(members, name);
  }

  /** Create an anonymous Struct. */
  static anon<Members extends GenericMembers>(members: Members) {
    return new Struct(members);
  }
}
