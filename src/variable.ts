import { Operator } from "./operators";
import { RValue } from "./rValue";
import { Type } from "./type";
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

  /** Returns the variable declaration statement. */
  declare() {
    return `${this.type} ${this.name}`;
  }

  /** Returns the reference expression for this variable. `&name` */
  ref() {
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

  /** Assign a value. */
  assign(value: CodeLike) {
    return Operator.assign(this.name, value);
  }

  /** Returns a subscript assignment statement. e.g. `ptr[3] = '\0'` */
  subAssign(index: CodeLike, value: CodeLike) {
    return Operator.assign(Operator.subscript(this.name, index), value);
  }

  plusAssign(value: CodeLike) {
    return Operator.plusAssign(this, value);
  }

  minusAssign(value: CodeLike) {
    return Operator.minusAssign(this, value);
  }

  /** `*=` */
  multAssign(value: CodeLike) {
    return Operator.multAssign(this, value);
  }

  /** `/=` */
  divAssign(value: CodeLike) {
    return Operator.divAssign(this, value);
  }

  /** `%=` */
  moduloAssign(value: CodeLike) {
    return Operator.moduloAssign(this, value);
  }

  postInc() {
    return Operator.postInc(this);
  }

  postDec() {
    return Operator.postDec(this);
  }

  preInc() {
    return Operator.preInc(this);
  }

  preDec() {
    return Operator.preDec(this);
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
