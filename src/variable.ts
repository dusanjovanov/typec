import { BaseValue } from "./baseValue";
import { Operator } from "./operators";
import { Pointer } from "./pointer";
import { Simple } from "./simple";
import type { CodeLike, PointerQualifier, TypeQualifier } from "./types";
import { Utils } from "./utils";
import { Value } from "./value";

/** Used for declaring and initializing simple type and pointer variables. */
export class Variable<T extends Simple | Pointer = any> extends BaseValue<T> {
  constructor(type: T, name: string) {
    super(type);
    this.type = type;
    this.name = name;
  }
  type;
  name;

  /** Returns the reference expression for this variable. `&name` */
  ref() {
    return Value.new(this.type.pointer(), Operator.ref(this.name));
  }

  /** Returns the dereference expression for this variable `*name`. Only works for pointers. */
  deRef(): DerefResult<T> {
    if (this.type.kind === "pointer") {
      return Value.new(this.type.inner(), Operator.deRef(this.name));
    }
    return Value.invalid();
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
    return Value.new(this.type, Operator.assign(this.name, value));
  }

  /** Returns a subscript assignment statement. e.g. `ptr[3] = '\0'` */
  subAssign(index: CodeLike, value: CodeLike) {
    return Operator.assign(Operator.subscript(this.name, index), value);
  }

  /**
   * Returns the smaller value expression using relational logical operators between this variable's name and another expression of the same type.
   */
  min(value: CodeLike) {
    return Value.new(this.type, Utils.min(this, value));
  }

  /** Returns an assignment expression with a clamped value between min and max. */
  clamp(min: CodeLike, max: CodeLike) {
    return Value.new(
      this.type,
      Operator.assign(this, Utils.clamp(this, min, max))
    );
  }

  plusAssign(value: CodeLike) {
    return Value.new(this.type, Operator.plusAssign(this, value));
  }

  toString() {
    return this.name;
  }

  static new<T extends Simple | Pointer>(type: T, name: string) {
    return new Variable(type, name);
  }

  static void(name: string, typeQualifiers?: TypeQualifier[]) {
    return Variable.new(Simple.void(typeQualifiers), name);
  }

  static char(name: string, typeQualifiers?: TypeQualifier[]) {
    return Variable.new(Simple.char(typeQualifiers), name);
  }

  static int(name: string, typeQualifiers?: TypeQualifier[]) {
    return Variable.new(Simple.int(typeQualifiers), name);
  }

  static size_t(name: string, typeQualifiers?: TypeQualifier[]) {
    return Variable.new(Simple.size_t(typeQualifiers), name);
  }

  /** Pointer variable for char*. */
  static string(
    name: string,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Variable.new(
      Pointer.string(typeQualifiers, pointerQualifiers),
      name
    );
  }

  static pointerVoid(
    name: string,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Variable.new(Pointer.void(typeQualifiers, pointerQualifiers), name);
  }

  static pointerInt(
    name: string,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Variable.new(Pointer.int(typeQualifiers, pointerQualifiers), name);
  }
}

export type DerefResult<T extends Simple | Pointer> = Value<
  T extends Pointer<infer PT> ? PT : Value<T>
>;
