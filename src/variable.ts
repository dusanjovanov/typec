import { Lit } from "./literal";
import { Stat } from "./statement";
import type { Struct } from "./struct";
import { Type } from "./type";
import type {
  GenericMembers,
  PointerQualifier,
  TypeArg,
  TypeQualifier,
  ValArg,
  ValArgWithArray,
} from "./types";
import type { Union } from "./union";
import { createMemberValues, isPlainObject } from "./utils";
import { Val } from "./val";

/** Used for working with variables of any type. */
export class Var<S extends string = any> extends Val<S> {
  constructor(type: TypeArg<S>, name: string) {
    super({
      kind: "name",
      type: Type.typeArgToType(type),
      name,
    });
    this.name = name;
  }
  name;

  /** Returns the variable declaration statement. */
  declare() {
    return Stat.varDeclaration(this.type, this.name);
  }

  /**
   * Returns the initialization statement for this Var.
   *
   * - If a `single non-array` value is passed, it returns a regular value initialization. `=value`
   *
   * - If `multiple non-array` values are passed, it returns a compound initialization. `={123, 456}`
   *
   * - If a `single array` value is passed, it returns a compound initialization. `={123, 456}`
   *
   * - If `multiple array` values are passed, it returns a multi-level compound initialization. `={{123, 456}, {789, 123}}`
   *
   * - If a `plain object` is passed ( not Val ), it returns a designated initialization.
   *
   *   - `{[0] = 123, [1] = 456}` - if the Var holds an array.
   *   - `{.abc = 123, .def = 456 }` - if the Var holds a struct or union.
   *
   */
  init(...values: ValArgWithArray[]) {
    if (values.length > 1) {
      return Stat.varInit(
        this,
        Lit.compound(
          ...values.map((v) => (Array.isArray(v) ? Lit.compound(...v) : v))
        )
      );
    }
    //
    else if (isPlainObject(values[0])) {
      return Stat.varInit(
        this,
        this.type.typeKind === "array"
          ? Lit.designatedSub(values[0] as any)
          : Lit.designatedDot(values[0] as any)
      );
    }
    //
    else if (Array.isArray(values[0])) {
      return Stat.varInit(this, Lit.compound(...values[0]));
    }
    //
    else {
      return Stat.varInit(this, values[0]);
    }
  }

  /** Returns the compound initialization. */
  initCompound(...values: ValArg[]) {
    return Stat.varInit(this, Lit.compound(...values));
  }

  /** Returns the designated sub initialization. */
  initDesignatedSub(values: Record<number, ValArg>) {
    return Stat.varInit(this, Lit.designatedSub(values));
  }

  /** Initialize with a designated dot initializer. */
  initDesignatedDot(values: Record<string | number, ValArg>) {
    return Stat.varInit(this, Lit.designatedDot(values));
  }

  /** Single value initializer. */
  initSingleMember(value: ValArg) {
    return Stat.varInit(this, Lit.singleMemberInit(value));
  }

  static int(name: string, typeQualifiers?: TypeQualifier[]) {
    return Var.new(Type.int(typeQualifiers), name);
  }

  static char(name: string, typeQualifiers?: TypeQualifier[]) {
    return Var.new(Type.char(typeQualifiers), name);
  }

  static size_t(name: string, typeQualifiers?: TypeQualifier[]) {
    return Var.new(Type.size_t(typeQualifiers), name);
  }

  /** Pointer variable for char*. */
  static string(
    name: string,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Var.new(Type.string(typeQualifiers, pointerQualifiers), name);
  }

  static float(name: string, typeQualifiers?: TypeQualifier[]) {
    return Var.new(Type.float(typeQualifiers), name);
  }

  static double(name: string, typeQualifiers?: TypeQualifier[]) {
    return Var.new(Type.double(typeQualifiers), name);
  }

  static bool(name: string, typeQualifiers?: TypeQualifier[]) {
    return Var.new(Type.bool(typeQualifiers), name);
  }

  static array<S extends string>(
    elementType: Type<S>,
    name: string,
    length: number | number[] | undefined = undefined
  ) {
    return Var.new(Type.array(elementType, length), name);
  }

  static struct<Name extends string, Members extends GenericMembers>(
    struct: Struct<Name, Members>,
    name: string,
    typeQualifiers?: TypeQualifier[]
  ) {
    return new VarStruct(struct.type(typeQualifiers), name, struct);
  }

  static structPointer<Name extends string, Members extends GenericMembers>(
    struct: Struct<Name, Members>,
    name: string,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return new VarStruct<`${Name}*`, Members>(
      struct.type(typeQualifiers).pointer(pointerQualifiers),
      name,
      struct as any
    );
  }

  static union<Name extends string, Members extends GenericMembers>(
    union: Union<Name, Members>,
    name: string,
    typeQualifiers?: TypeQualifier[]
  ) {
    return new VarUnion(union.type(typeQualifiers), name, union);
  }

  static unionPointer<Name extends string, Members extends GenericMembers>(
    union: Union<Name, Members>,
    name: string,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return new VarUnion<`${Name}*`, Members>(
      union.type(typeQualifiers).pointer(pointerQualifiers),
      name,
      union as any
    );
  }

  static new<S extends string>(type: TypeArg<S>, name: string) {
    return new Var(type, name);
  }
}

export class VarStruct<
  Name extends string,
  Members extends GenericMembers
> extends Var<Name> {
  constructor(
    type: TypeArg<Name>,
    name: string,
    struct: Struct<Name, Members>
  ) {
    super(type, name);
    this.struct = struct;

    this._ = createMemberValues(this, struct);
  }
  struct;
  /** A typed dictionary of arrow/dot access ( arrow if pointer ) Val objects for each member. */
  _;

  /** Returns assignments to multiple struct members. */
  assignMulti(values: Partial<Record<keyof Members, ValArg>>) {
    const memberAccess = this.type.typeKind === "pointer" ? "arrow" : "dot";

    return Object.entries(values).map(([key, value]) => {
      return this[memberAccess](key).assign(value!);
    });
  }
}

export class VarUnion<
  Name extends string,
  Members extends GenericMembers
> extends Var<Name> {
  constructor(type: TypeArg<Name>, name: string, union: Union<Name, Members>) {
    super(type, name);
    this.union = union;

    this._ = createMemberValues(this, union);
  }
  union;
  /** A typed dictionary of arrow/dot access ( arrow if pointer ) Val objects for each member. */
  _;
}
