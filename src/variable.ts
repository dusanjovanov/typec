import { Val } from "./rValue";
import type { Struct } from "./struct";
import { Type } from "./type";
import type {
  GenericApi,
  PointerQualifier,
  TypeArg,
  TypeQualifier,
  ValArg,
} from "./types";
import { Utils } from "./utils";

/** Used for working with variables of any type. */
export class Var<S extends string> extends Val<S> {
  constructor(type: TypeArg<S>, name: string) {
    super({
      kind: "name",
      type: Type.typeArgToType(type),
      name,
    });
    this.name = name;
  }
  kind = "variable" as const;
  name;

  isArray() {
    return this.type.desc.kind === "array";
  }

  /** Returns the variable declaration statement. */
  declare() {
    return this.type.declare(this.name);
  }

  /** Initialize with a value. */
  init(value: ValArg) {
    return `${this.declare()}=${value}`;
  }

  /** Returns the compound initialization. */
  initCompound(...values: ValArg[]) {
    // return Op.assign(
    //   this.type,
    //   this.declare(),
    //   semicolon(Lit.compound(...values))
    // );
  }

  /** Returns the designated sub initialization. */
  initDesignatedSub(values: Record<number, ValArg>) {
    // return Op.assign(
    //   this.type,
    //   this.declare(),
    //   semicolon(Lit.designatedSub(values))
    // );
  }

  /** Initialize with a designated dot initializer. */
  initDesignatedDot(values: Record<string | number, ValArg>) {
    // return Op.assign(
    //   this.type,
    //   this.declare(),
    //   semicolon(Lit.designatedDot(values))
    // );
  }

  /** Single value initializer. */
  initSingleMember(value: ValArg) {
    // return Op.assign(
    //   this.type,
    //   this.declare(),
    //   Lit.singleMemberInit(value)
    // );
  }

  /**
   * Returns a `VarApi` object for this `Var` with bound functions.
   */
  api<Api extends GenericApi>(funcs: Api) {
    return new VarApi(this.type, this.name, funcs);
  }

  static void(name: string, typeQualifiers?: TypeQualifier[]) {
    return Var.new(Type.void(typeQualifiers), name);
  }

  static char(name: string, typeQualifiers?: TypeQualifier[]) {
    return Var.new(Type.char(typeQualifiers), name);
  }

  static int(name: string, typeQualifiers?: TypeQualifier[]) {
    return Var.new(Type.int(typeQualifiers), name);
  }

  static size_t(name: string, typeQualifiers?: TypeQualifier[]) {
    return Var.new(Type.size_t(typeQualifiers), name);
  }

  static bool(name: string, typeQualifiers?: TypeQualifier[]) {
    return Var.new(Type.bool(typeQualifiers), name);
  }

  static float(name: string, typeQualifiers?: TypeQualifier[]) {
    return Var.new(Type.float(typeQualifiers), name);
  }

  static array<S extends string>(
    elementType: Type<S>,
    name: string,
    length: number | number[] | undefined = undefined
  ) {
    return Var.new(Type.array(elementType, length), name);
  }

  static struct<Name extends string>(
    struct: Struct<Name, any>,
    name: string,
    typeQualifiers?: TypeQualifier[]
  ) {
    return Var.new(struct.type(typeQualifiers), name);
  }

  /** Pointer variable for char*. */
  static string(
    name: string,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Var.new(Type.string(typeQualifiers, pointerQualifiers), name);
  }

  /**
   * Returns a `VarApi` object with bound functions.
   */
  static api<Api extends GenericApi>(type: TypeArg, name: string, funcs: Api) {
    return new VarApi(type, name, funcs);
  }

  static new<S extends string>(type: TypeArg<S>, name: string) {
    return new Var(type, name);
  }
}

/** tc equivalent of a class based api. */
export class VarApi<S extends string, Api extends GenericApi> extends Var<S> {
  constructor(type: TypeArg<S>, name: string, api: Api) {
    super(type, name);
    this._ = Utils.bindFuncs(this.ref(), api);
  }
  _;
}
