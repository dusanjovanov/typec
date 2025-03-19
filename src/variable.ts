import { BaseValue } from "./baseValue";
import { Operator } from "./operators";
import { Type } from "./type";
import type { CodeLike, PointerQualifier, TypeQualifier } from "./types";
import { Utils } from "./utils";
import { Value } from "./value";

/** Used for working with simple and pointer variables. */
export class Variable extends BaseValue {
  constructor(type: Type, name: string) {
    super(name);
    this.type = type;
    this.name = name;
  }
  kind = "variable" as const;
  type;
  name;

  /** Returns the reference expression for this variable. `&name` */
  ref() {
    return Value.new(Operator.ref(this.name));
  }

  /** Returns the dereference expression for this variable `*name`. Only works for pointers. */
  deRef() {
    return Value.new(Operator.deRef(this.name));
  }

  /** Returns the variable declaration statement. */
  declare() {
    return `${this.type.full} ${this.name}`;
  }

  /** Initialize with a value. */
  init(value: CodeLike) {
    return Operator.assign(this.declare(), value);
  }

  /** Assign a value. */
  assign(value: CodeLike) {
    return Value.new(Operator.assign(this.name, value));
  }

  /** Returns a subscript assignment statement. e.g. `ptr[3] = '\0'` */
  subAssign(index: CodeLike, value: CodeLike) {
    return Operator.assign(Operator.subscript(this.name, index), value);
  }

  /**
   * Returns the smaller value expression using relational logical operators between this variable's name and another expression of the same type.
   */
  min(value: CodeLike) {
    return Value.new(Utils.min(this, value));
  }

  /** Returns an assignment expression with a clamped value between min and max. */
  clamp(min: CodeLike, max: CodeLike) {
    return Value.new(Operator.assign(this, Utils.clamp(this, min, max)));
  }

  plusAssign(value: CodeLike) {
    return Value.new(Operator.plusAssign(this, value));
  }

  minusAssign(value: CodeLike) {
    return Value.new(Operator.minusAssign(this, value));
  }

  /** `*=` */
  multAssign(value: CodeLike) {
    return Value.new(Operator.multAssign(this, value));
  }

  /** `/=` */
  divAssign(value: CodeLike) {
    return Value.new(Operator.divAssign(this, value));
  }

  /** `%=` */
  moduloAssign(value: CodeLike) {
    return Value.new(Operator.moduloAssign(this, value));
  }

  postInc() {
    return Value.new(Operator.postInc(this));
  }

  postDec() {
    return Value.new(Operator.postDec(this));
  }

  preInc() {
    return Value.new(Operator.preInc(this));
  }

  preDec() {
    return Value.new(Operator.preDec(this));
  }

  static new(type: Type, name: string) {
    return new Variable(type, name);
  }

  static void(name: string, typeQualifiers?: TypeQualifier[]) {
    return Variable.new(Type.void(typeQualifiers), name);
  }

  static char(name: string, typeQualifiers?: TypeQualifier[]) {
    return Variable.new(Type.char(typeQualifiers), name);
  }

  static int(name: string, typeQualifiers?: TypeQualifier[]) {
    return Variable.new(Type.int(typeQualifiers), name);
  }

  static size_t(name: string, typeQualifiers?: TypeQualifier[]) {
    return Variable.new(Type.size_t(typeQualifiers), name);
  }

  /** Pointer variable for char*. */
  static string(
    name: string,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Variable.new(Type.string(typeQualifiers, pointerQualifiers), name);
  }

  static pointerVoid(
    name: string,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Variable.new(Type.ptrVoid(typeQualifiers, pointerQualifiers), name);
  }

  static pointerInt(
    name: string,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Variable.new(Type.ptrInt(typeQualifiers, pointerQualifiers), name);
  }
}
