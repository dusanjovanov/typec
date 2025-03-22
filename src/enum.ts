import { Block } from "./chunk";
import { NULL } from "./constants";
import { Type } from "./type";
import type { PointerQualifier, TypeQualifier } from "./types";
import { Value } from "./value";
import { Var } from "./variable";

/** Used for declaring and working with enums. */
export class Enum<Values extends Record<string, string | number | null>> {
  constructor(name: string, values: Values) {
    this.name = name;
    this.__values = values;

    const keys: Record<string, any> = {};
    const newValues: Record<string, any> = {};

    Object.entries(values).forEach(([name, value]) => {
      keys[name] = Value.new(name);
      newValues[name] = Value.new(value ?? NULL);
    });

    this.keys = keys as {
      [key in keyof Values]: Value;
    };
    this.values = newValues as {
      [key in keyof Values]: Value;
    };
  }
  name;
  __values;
  /**
   * Access the names of the enum defined values by name.
   *
   * ```ts
   * const myEnum = Enum.new("my_enum", {
   *  A: 0,
   *  B: 1,
   *  C: null
   * })
   *
   * myEnum.keys.A === Value("A")
   * myEnum.keys.C === Value("C")
   * ```
   */
  keys;
  /**
   * Access the values of the enum defined values by name.
   *
   * typec doesn't automatically increment enum values like C does,
   * so if you passed null when defining a value, you're going to get a null when accessing it.
   *
   * ```ts
   * const myEnum = Enum.new("my_enum", {
   *  A: 0,
   *  B: 1,
   *  C: null
   * })
   *
   * myEnum.values.A === Value(0)
   * myEnum.values.C === Value(NULL)
   * ```
   */
  values;

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

  static new<Values extends Record<string, string | number | null>>(
    name: string,
    values: Values
  ) {
    return new Enum(name, values);
  }
}
