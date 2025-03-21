import { Block } from "./chunk";
import { Type } from "./type";
import type { PointerQualifier, TypeQualifier } from "./types";
import { Value } from "./value";
import { Var } from "./variable";

/** Used for declaring and working with enums. */
export class Enum<Values extends Record<string, number | null>> {
  constructor(name: string, values: Values) {
    this.name = name;
    this.__values = values;

    const names: Record<string, any> = {};

    Object.keys(values).forEach((name) => {
      names[name] = Value.new(name);
    });

    this.names = names as {
      [key in keyof Values]: Value;
    };
  }
  name;
  __values;
  /** Access names of the enum value by name. */
  names;

  declare() {
    return `enum ${this.name}${Block.new(
      Object.entries(this.__values).map(([name, value]) => `${name}=${value}`)
    )}`;
  }

  /** Get a variable type for this enum. */
  type(qualifiers?: TypeQualifier[]) {
    return Type.enum(this.name, qualifiers);
  }

  /** Get a pointer variable type for this enum. */
  pointerType(
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Type.enumPointer(this.name, typeQualifiers, pointerQualifiers);
  }

  /** Returns a Var to hold a value of this enum. */
  var(name: string, qualifiers?: TypeQualifier[]) {
    return Var.new(this.type(qualifiers), name);
  }

  /** Returns a Var to hold a `pointer` to a value of this enum. */
  pointer(
    name: string,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Var.new(this.pointerType(typeQualifiers, pointerQualifiers), name);
  }

  static new<Values extends Record<string, number>>(
    name: string,
    values: Values
  ) {
    return new Enum(name, values);
  }
}
