import { Lit } from "./literal";
import { Stat } from "./statement";
import type { Struct } from "./struct";
import { Type } from "./type";
import type {
  BoundFuncs,
  GenericApi,
  GenericFunc,
  PointerQualifier,
  TypeArg,
  TypeQualifier,
  ValArg,
} from "./types";
import { Utils } from "./utils";
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
  init(value: ValArg) {
    return Stat.varInit(this, value);
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

  static struct<Name extends string>(
    struct: Struct<Name, any>,
    name: string,
    typeQualifiers?: TypeQualifier[]
  ) {
    return Var.new(struct.type(typeQualifiers), name);
  }

  /**
   * Returns a `VarApi` object with bound functions.
   */
  static api<S extends string, Api extends GenericApi>(
    type: TypeArg<S>,
    name: string,
    funcs: Api,
    getExp?: (variable: Var<S>, fn: GenericFunc) => ValArg
  ) {
    return new VarApi(type, name, funcs, getExp);
  }

  static new<S extends string>(type: TypeArg<S>, name: string) {
    return new Var(type, name);
  }
}

/**
 * tc equivalent of a class based api for a Var.
 */
export class VarApi<S extends string, Api extends GenericApi> extends Var<S> {
  constructor(
    type: TypeArg<S>,
    name: string,
    api: Api,
    getExp?: (variable: Var<S>, fn: GenericFunc) => ValArg
  ) {
    super(type, name);
    this.$ = Utils.bindFuncs(
      getExp
        ? (fn) => {
            return getExp(this, fn);
          }
        : this,
      api
    );
  }
  $: BoundFuncs<Api>;
}
