import { BRANDING_MAP } from "./branding";
import { Param } from "./param";
import { Stat } from "./statement";
import { Type } from "./type";
import type {
  GenericApi,
  GenericMembers,
  PointerQualifier,
  TypeQualifier,
} from "./types";
import { Var } from "./variable";

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

  /** Get a struct var type for this struct. */
  type(qualifiers?: TypeQualifier[]) {
    return Type.struct<Name>(this.name, qualifiers);
  }

  var(name: string, typeQualifiers?: TypeQualifier[]) {
    return Var.new(this.type(typeQualifiers), name);
  }

  /** Pointer Var */
  pointer(
    name: string,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Var.new(this.type(typeQualifiers).pointer(pointerQualifiers), name);
  }

  /** param */
  par<Name extends string>(name: Name, typeQualifiers?: TypeQualifier[]) {
    return Param.new(this.type(typeQualifiers), name);
  }

  /** Pointer param */
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
