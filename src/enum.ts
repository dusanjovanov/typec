import { curly } from "./chunk";
import { Type } from "./type";
import type { PointerQualifier, TypeQualifier } from "./types";
import { join } from "./utils";
import { Value } from "./value";
import { Var } from "./variable";

/** Used for declaring and working with enums. */
export class Enum<
  Name extends string,
  Values extends Record<string, string | number | null>
> {
  constructor(name: Name, values: Values) {
    this.name = name;
    this.__values = values;

    const keys: Record<string, any> = {};

    Object.keys(values).forEach((name) => {
      keys[name] = Value.new(name);
    });

    this.keys = keys as {
      [key in keyof Values]: Value;
    };
  }
  kind = "enum" as const;
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

  declare() {
    return `enum ${this.name}${curly(
      join(
        Object.entries(this.__values).map(([name, value]) => {
          if (value == null) {
            return name;
          }
          return `${name}=${value}`;
        }),
        ","
      )
    )};`;
  }

  embed() {
    return this.declare();
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
    return this.type(typeQualifiers).pointer(pointerQualifiers);
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

  static new<
    Name extends string,
    Values extends Record<string, string | number | null>
  >(name: Name, values: Values) {
    return new Enum(name, values);
  }

  /** Api-only Enum that comes from an external library. */
  static api<Name extends string, const Keys extends readonly string[]>(
    name: Name,
    keys: Keys
  ) {
    return new Enum(
      name,
      keys.reduce((prev, key) => {
        (prev as any)[key] = null;
        return prev;
      }, {} as ValuesFromKeys<Keys>)
    );
  }
}

type ValuesFromKeys<Keys extends readonly string[]> = Keys extends readonly []
  ? {}
  : Keys extends readonly [infer First extends string, ...infer Rest]
  ? Rest extends readonly string[]
    ? Record<First, null> & ValuesFromKeys<Rest>
    : Record<First, null>
  : {};
