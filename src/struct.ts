import { block } from "./chunk";
import { assign, ref } from "./operators";
import { Type } from "./type";
import type {
  AutoPointerQualifier,
  AutoQualifier,
  StringKeyOf,
  StringLike,
  StructMembers,
  StructMemberValuesFromMembers,
} from "./types";
import { join } from "./utils";

export class Struct<Members extends StructMembers> {
  constructor(name: string, members: Members) {
    this.name = name;
    this.members = members;
    this.type = Type.struct(this.name);
    this.declaration = `${this.type.full}${block(
      Object.entries(this.members).map(([name, type]) => `${type} ${name}`)
    )}`;
  }
  name;
  members;
  type;
  declaration;

  var(name: string, qualifier?: AutoQualifier) {
    return new StructVar(this, name, qualifier);
  }

  literal(values: StructMemberValuesFromMembers<Members>) {
    return `{ ${join(
      Object.entries(values).map(([name, value]) => `.${name}=${value}`),
      ","
    )} }`;
  }

  literalSeq(values: StringLike[]) {
    return `{ ${join(values, ",")} }`;
  }
}

export class StructVar<Members extends StructMembers> {
  constructor(
    struct: Struct<Members>,
    name: string,
    qualifier?: AutoQualifier
  ) {
    this.struct = struct;
    this.name = name;
    this.type = Type.var(this.struct.type.full, qualifier);
    this.declaration = `${this.type} ${this.name}`;
    this.ref = ref(this.name);
  }
  struct;
  type;
  name;
  declaration;
  ref;

  init(values: StructMemberValuesFromMembers<Members>) {
    return assign(this.declaration, this.struct.literal(values));
  }

  initSeq(values: StringLike[]) {
    return assign(this.declaration, this.struct.literalSeq(values));
  }

  assignVar(structVar: StructVar<Members>) {
    return assign(this.name, structVar.name);
  }

  assign(values: StructMemberValuesFromMembers<Members>) {
    return assign(this.name, this.struct.literal(values));
  }

  assignSeq(values: StringLike[]) {
    return assign(this.name, this.struct.literalSeq(values));
  }

  pointer(name: string, qualifier?: AutoPointerQualifier) {
    return new StructPointer(this, name, qualifier);
  }

  byValue(member: StringKeyOf<Members>) {
    return `${this.name}.${member}`;
  }
}

export class StructPointer<Members extends StructMembers> {
  constructor(
    source: StructVar<Members> | StructPointer<Members>,
    name: string,
    qualifier?: AutoPointerQualifier
  ) {
    this.source = source;
    this.type = Type.pointer(this.source.type.full, qualifier);
    this.name = name;
    this.declaration = `${this.type} ${this.name}`;
    this.init = assign(this.declaration, this.source.ref);
    this.assign = assign(this.name, this.source.ref);
    this.ref = ref(this.name);
  }
  source;
  type;
  name;
  declaration;
  init;
  assign;
  ref;

  byRef(member: StringKeyOf<Members>) {
    return `${this.name}->${member}`;
  }

  pointer(name: string) {
    return new StructPointer(this, name);
  }
}
