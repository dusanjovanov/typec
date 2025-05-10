import { semicolon } from "./chunk";
import { Lit } from "./literal";
import { Operator } from "./operators";
import { RValue } from "./rValue";
import type { Struct } from "./struct";
import { Type, type ArrayType } from "./type";
import type { CodeLike, PointerQualifier, TypeQualifier } from "./types";
import { Value } from "./value";

/** Used for working with simple and pointer variables. */
export class Var extends RValue {
  constructor(type: Type, name: string) {
    super(name);
    this.type = type;
    this.name = name;
  }
  kind = "variable" as const;
  type;
  name;

  private declareArray(type: ArrayType) {
    let str = `${type.elementType} ${this.name}`;

    if (type.length == null) {
      str += "[]";
    }
    //
    else if (Array.isArray(type.length)) {
      str += type.length.map((l) => `[${l}]`).join("");
    }
    //
    else {
      str += `[${type.length}]`;
    }

    return str;
  }

  isArray() {
    return this.type.desc.kind === "array";
  }

  /** Returns the variable declaration statement. */
  declare() {
    if (this.isArray()) {
      return this.declareArray(this.type.desc as ArrayType);
    }
    return `${this.type} ${this.name}`;
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

  /** Simple member initializer. */
  initSimple(value: CodeLike) {
    return Operator.assign(this.declare(), Lit.simpleMember(value));
  }

  static new(type: Type, name: string) {
    return new Var(type, name);
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

  static array(
    elementType: Type,
    name: string,
    length: number | number[] | undefined = undefined
  ) {
    return Var.new(Type.array(elementType, length), name);
  }

  static struct(s: Struct, name: string, typeQualifiers?: TypeQualifier[]) {
    return Var.new(s.type(typeQualifiers), name);
  }

  static structPointer(
    s: Struct,
    name: string,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Var.new(s.pointerType(typeQualifiers, pointerQualifiers), name);
  }

  /** Pointer variable for char*. */
  static string(
    name: string,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Var.new(Type.string(typeQualifiers, pointerQualifiers), name);
  }

  static pointerVoid(
    name: string,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Var.new(Type.voidPointer(typeQualifiers, pointerQualifiers), name);
  }

  static pointerInt(
    name: string,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Var.new(Type.intPointer(typeQualifiers, pointerQualifiers), name);
  }
}
