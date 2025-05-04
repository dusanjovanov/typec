import { Lit } from "./literal";
import { Operator } from "./operators";
import { RValue } from "./rValue";
import type { Type } from "./type";
import type { CodeLike, GenericMembers, StringKeyOf } from "./types";

export class UnionVar<Members extends GenericMembers = any> extends RValue {
  constructor(type: Type, name: string, members: Members) {
    super(name);
    this.type = type;
    this.name = name;
    this.members = members;
  }
  kind = "unionVar" as const;
  type;
  name;
  members;

  /** Returns the variable declaration statement. */
  declare() {
    return `${this.type} ${this.name}`;
  }

  /** Returns the reference expression for this variable. `&name` */
  ref() {
    return Operator.ref(this.name);
  }

  /** Returns the dereference expression for this variable `*name`. Only works for pointers. */
  deRef() {
    return Operator.deRef(this.name);
  }

  /** Initialize with a value. */
  init(value: CodeLike) {
    return Operator.assign(this.declare(), value);
  }

  /** Simple member initializer. */
  initSimple(value: CodeLike) {
    return Operator.assign(this.declare(), Lit.simpleMember(value));
  }

  /** Initialize member with a designated initializer. */
  initDesignated(key: StringKeyOf<Members>, value: CodeLike) {
    return Operator.assign(this.declare(), Lit.designatedDot({ [key]: value }));
  }

  /** Initialize member with a compound initializer. */
  initCompound(value: CodeLike) {
    return Operator.assign(this.declare(), Lit.compound(value));
  }

  /** Access a member of the struct directly. */
  dot(key: StringKeyOf<Members>) {
    return Operator.dot(this, key);
  }

  /** Access a member of the struct through a pointer. */
  arrow(key: StringKeyOf<Members>) {
    return Operator.arrow(this, key);
  }

  static new<Members extends GenericMembers = any>(
    type: Type,
    name: string,
    members: Members
  ) {
    return new UnionVar(type, name, members);
  }
}
