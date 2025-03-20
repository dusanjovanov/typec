import { Block } from "./chunk";
import { StructVar } from "./structVar";
import { Type } from "./type";
import type { PointerQualifier, StructMembers, TypeQualifier } from "./types";

/** Used for declaring and working with structs. */
export class Struct<Members extends StructMembers = any> {
  constructor(name: string, members: Members) {
    this.name = name;
    this.members = members;
  }
  name;
  members;

  /** Returns the struct declaration ( definition ). */
  declare() {
    return `struct ${this.name}${Block.new(
      Object.entries(this.members).map(([name, type]) => `${type} ${name}`)
    )}`;
  }

  /** Get a struct var type for this struct. */
  type(qualifiers?: TypeQualifier[]) {
    return Type.struct(this.name, qualifiers);
  }

  /** Get a struct pointer var type for this struct. */
  pointerType(
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Type.structPointer(this.name, typeQualifiers, pointerQualifiers);
  }

  /** Returns a StructVar to hold an instance of this Struct. */
  var(name: string, qualifiers?: TypeQualifier[]) {
    return StructVar.new(this.type(qualifiers), name, this.members);
  }

  /** Returns a StructVar to hold a `pointer` to an instance of this Struct. */
  pointer(
    name: string,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return StructVar.new(
      this.pointerType(typeQualifiers, pointerQualifiers),
      name,
      this.members
    );
  }

  static new<Members extends StructMembers>(name: string, members: Members) {
    return new Struct(name, members);
  }
}
