import { BRANDING_MAP } from "./brand";
import { Stat } from "./statement";
import { Type } from "./type";
import type {
  GenericEnumValues,
  PointerQualifier,
  TypeQualifier,
} from "./types";
import { Val } from "./val";

/** Used for declaring and working with enums. */
export class Enum<
  Name extends string = any,
  Values extends GenericEnumValues = any
> {
  constructor(name: Name, values: Values) {
    this.name = name;
    this._values = values;

    const keys: Record<string, any> = {};

    Object.keys(values).forEach((name) => {
      keys[name] = Val.int(name);
    });

    this._ = keys as {
      [key in keyof Values]: Val<"int">;
    };
  }
  kind = BRANDING_MAP.enum;
  name;
  _values;
  /**
   * Dictionary of enum values as `Val<"int">` objects.
   */
  _;

  declare() {
    return Stat.enum(this.name, this._values);
  }

  /** Get a variable type for this enum. */
  type(qualifiers?: TypeQualifier[]) {
    return Type.enum(this.name, qualifiers);
  }

  /** Returns a Var to hold a `pointer` to a value of this enum. */
  pointer(
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return this.type(typeQualifiers).pointer(pointerQualifiers);
  }

  static new<
    Name extends string,
    Values extends Record<string, string | number | null>
  >(name: Name, values: Values) {
    return new Enum(name, values);
  }
}
