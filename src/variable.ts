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
} from "./types";
import type { Union } from "./union";
import { createMemberValues } from "./utils";
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

  /** Initialize with a value. */
  init(...values: ValArg[]) {
    if (values.length > 1) {
      return Stat.varInit(this, Lit.compound(...values));
    }
    //
    else if (
      typeof values[0] === "object" &&
      values[0].constructor === Object
    ) {
      return Stat.varInit(
        this,
        this.type.typeKind === "array"
          ? Lit.designatedSub(values[0] as any)
          : Lit.designatedDot(values[0] as any)
      );
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
