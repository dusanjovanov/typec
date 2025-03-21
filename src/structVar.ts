import { Lit } from "./literal";
import { Operator } from "./operators";
import { Type } from "./type";
import type {
  CodeLike,
  StringKeyOf,
  StructDesignatedInitValues,
  StructMembers,
} from "./types";

/** Used for working with struct instance variables and pointers. */
export class StructVar<Members extends StructMembers = any> {
  constructor(type: Type, name: string, members: Members) {
    this.type = type;
    this.name = name;
    this.members = members;
  }
  kind = "structVar" as const;
  type;
  name;
  members;

  /** Returns the variable declaration statement. */
  declare() {
    return `${this.type.str} ${this.name}`;
  }

  /** Returns the reference expression for this variable. `&name` */
  ref() {
    return Operator.ref(this.name);
  }

  /** Returns the dereference expression for this variable `*name`. Only works for pointers. */
  deRef() {
    return Operator.deRef(this.name);
  }

  /** Initialize with a designated initializer. */
  init(values: StructDesignatedInitValues<Members>) {
    return Operator.assign(this.declare(), Lit.designatedDot(values));
  }

  /** Initialize with a compound initializer. */
  initCompound(...values: CodeLike[]) {
    return Operator.assign(this.declare(), Lit.compound(...values));
  }

  /** Access a member of the struct directly. */
  dot(key: StringKeyOf<Members>) {
    return Operator.dot(this, key);
  }

  /** Access a member of the struct through a pointer. */
  arrow(key: StringKeyOf<Members>) {
    return Operator.arrow(this, key);
  }

  static new<Members extends StructMembers = any>(
    type: Type,
    name: string,
    members: Members
  ) {
    return new StructVar(type, name, members);
  }
}
