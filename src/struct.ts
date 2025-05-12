import { Param } from "./param";
import { RValue } from "./rValue";
import { Type } from "./type";
import type { Members, PointerQualifier, TypeQualifier } from "./types";
import { Var } from "./variable";

/** Used for declaring and working with structs. */
export class Struct extends RValue {
  constructor(members: Members, name: string | null = null) {
    super(`struct ${name}`);
    this.name = name;
    this.members = members;
  }
  name;
  members;

  /** Returns the struct declaration ( definition ). */
  declare() {
    return `struct ${this.name}${Type.membersBlock(this.members)};`;
  }

  embed() {
    return this.declare();
  }

  /** Get a struct var type for this struct. */
  type(qualifiers?: TypeQualifier[]) {
    return Type.struct(this.name, qualifiers);
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

  static new(name: string, members: Members) {
    return new Struct(members, name);
  }

  /** Create an anonymous Struct. */
  static anon(members: Members) {
    return new Struct(members);
  }
}
