import { Par } from "./param";
import { Type } from "./type";
import type {
  GenericApi,
  GenericMembers,
  PointerQualifier,
  TypeQualifier,
} from "./types";
import { Var } from "./variable";

/** Used for declaring and working with structs. */
export class Struct<Name extends string, Members extends GenericMembers> {
  constructor(members: Members, name: Name = null as unknown as Name) {
    this.name = name;
    this.members = members;
  }
  kind = "struct" as const;
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
    return Type.struct<Name>(this.name, qualifiers);
  }

  var(name: string, typeQualifiers?: TypeQualifier[]) {
    return Var.new(this.type(typeQualifiers), name);
  }

  /** Pointer Var */
  ptr(
    name: string,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Var.new(this.type(typeQualifiers).ptr(pointerQualifiers), name);
  }

  /** param */
  par<Name extends string>(name: Name, typeQualifiers?: TypeQualifier[]) {
    return Par.new(this.type(typeQualifiers), name);
  }

  /** Pointer param */
  ptrPar<Name extends string>(
    name: Name,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Par.new(this.type(typeQualifiers).ptr(pointerQualifiers), name);
  }

  varApi<Api extends GenericApi>(name: string, api: Api) {
    return Var.api(this.type(), name, api);
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
