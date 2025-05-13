import { semicolon } from "./chunk";
import { Lit } from "./literal";
import { Operator } from "./operators";
import { RValue } from "./rValue";
import type { Struct } from "./struct";
import { Type } from "./type";
import type {
  CodeLike,
  GenericApi,
  PointerQualifier,
  TypeArg,
  TypeQualifier,
} from "./types";
import { typeArgToType, Utils } from "./utils";
import { Value } from "./value";

/** Used for working with variables. */
export class Var<S extends string> extends RValue {
  constructor(type: TypeArg<S>, name: string) {
    super(name);
    this.type = typeArgToType(type);
    this.name = name;
  }
  kind = "variable" as const;
  type;
  name;

  isArray() {
    return this.type.desc.kind === "array";
  }

  /** Returns the variable declaration statement. */
  declare() {
    return this.type.declare(this.name);
  }

  /**
   * Returns the reference expression for this variable. `&name`.
   *
   * For arrays, it returns the array's name as a Value, which is what you usually want ( i.e. the reference to the first element of the array ).
   *
   * If you want the ref to the array itself - use `refArray`.
   */
  ref() {
    if (this.isArray()) {
      return Value.new(this.name);
    }
    return Operator.ref(this.name);
  }

  refArray() {
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

  /** Returns the compound initialization. */
  initCompound(...values: CodeLike[]) {
    return Operator.assign(this.declare(), semicolon(Lit.compound(...values)));
  }

  /** Returns the designated sub initialization. */
  initDesignatedSub(values: Record<number, CodeLike>) {
    return Operator.assign(
      this.declare(),
      semicolon(Lit.designatedSub(values))
    );
  }

  /** Initialize with a designated dot initializer. */
  initDesignatedDot(values: Record<string | number, CodeLike>) {
    return Operator.assign(
      this.declare(),
      semicolon(Lit.designatedDot(values))
    );
  }

  /** Single value initializer. */
  initSingleMember(value: CodeLike) {
    return Operator.assign(this.declare(), Lit.singleMemberInit(value));
  }

  /**
   * Returns a `VarApi` object for this `Var` with bound functions.
   */
  api<Api extends GenericApi>(funcs: Api) {
    return new VarApi(this.type, this.name, funcs);
  }

  static new<S extends string>(type: TypeArg<S>, name: string) {
    return new Var(type, name);
  }

  /**
   * Returns a `VarApi` object with bound functions.
   */
  static api<Api extends GenericApi>(type: TypeArg, name: string, funcs: Api) {
    return new VarApi(type, name, funcs);
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
}

/** tc equivalent of a class based api. */
export class VarApi<S extends string, Api extends GenericApi> extends Var<S> {
  constructor(type: TypeArg<S>, name: string, api: Api) {
    super(type, name);
    this._ = Utils.bindFuncs(this.ref(), api);
  }
  _;
}
