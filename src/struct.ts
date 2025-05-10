import { Block } from "./chunk";
import { Param } from "./param";
import { RValue } from "./rValue";
import { Type } from "./type";
import type { GenericMembers, PointerQualifier, TypeQualifier } from "./types";
import { Var } from "./variable";

/** Used for declaring and working with structs. */
export class Struct<Members extends GenericMembers = any> extends RValue {
  constructor(members: Members, name: string | null = null) {
    super(`struct ${name}`);
    this.name = name;
    this.members = members;
  }
  name;
  members;

  /** Returns the struct declaration ( definition ). */
  declare() {
    return `struct ${this.name}${Block.new(
      ...Object.entries(this.members).map(([name, type]) => `${type} ${name}`)
    )};`;
  }

  embed() {
    return this.declare();
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

  var(name: string, typeQualifiers?: TypeQualifier[]) {
    return Var.new(this.type(typeQualifiers), name);
  }

  pointer(
    name: string,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Var.new(this.pointerType(typeQualifiers, pointerQualifiers), name);
  }

  param<Name extends string>(name: Name, typeQualifiers?: TypeQualifier[]) {
    return Param.new(this.type(typeQualifiers), name);
  }

  pointerParam<Name extends string>(
    name: Name,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Param.new(this.pointerType(typeQualifiers, pointerQualifiers), name);
  }

  static new<Members extends GenericMembers>(name: string, members: Members) {
    return new Struct(members, name);
  }

  /** Create an anonymous Struct. */
  static anon<Members extends GenericMembers>(members: Members) {
    return new Struct(members);
  }
}
