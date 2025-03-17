import { Operator } from "./operators";
import { Pointer } from "./pointer";
import { Simple } from "./simple";
import type {
  IntegerValue,
  InvalidValue,
  NumberValue,
  PointerDiffValue,
  PointerQualifier,
  TypeQualifier,
  TypeToAssignValue,
} from "./types";
import { Utils } from "./utils";
import { Value } from "./value";

/** Used for declaring and initializing simple type and pointer variables. */
export class Variable<T extends Simple | Pointer = any> {
  constructor(type: T, name: string) {
    this.type = type;
    this._name = name;
  }
  type;
  _name;

  /** Returns this variable's name expression wrapped in a Value. */
  name() {
    return Value.new(this.type, this._name) as Value<T>;
  }

  /** Returns the reference expression for this variable. `&name` */
  ref() {
    return Value.new(
      this.type.pointer(),
      Operator.ref(this._name)
    ) as VarRefResult<T>;
  }

  /** Returns the dereference expression for this variable `*name`. Only works for pointers. */
  deRef() {
    if (this.type.kind === "pointer") {
      return Value.new(
        this.type.inner(),
        Operator.deRef(this._name)
      ) as VarDerefResult<T>;
    }
    return Value.invalid() as VarDerefResult<T>;
  }

  /** Returns the variable declaration statement. */
  declare() {
    return `${this.type.full} ${this._name}`;
  }

  /** Initialize with a value. */
  init(value: TypeToAssignValue<T>) {
    return Operator.assign(this.declare(), value);
  }

  /** Assign a value. */
  assign(value: TypeToAssignValue<T>) {
    return Operator.assign(this._name, value);
  }

  /** Returns the `+` binary expression between this variable's name and a number value expression. */
  plus<V extends NumberValue | Value<Pointer>>(value: V): PlusResult<T, V> {
    const exp = Operator.plus(this.name(), value);

    switch (this.type.kind) {
      case "simple": {
        if (value.type.kind === "pointer") {
          return this.type.toValue(exp) as PlusResult<T, V>;
        }
        return Value.new(Simple.int(), exp) as PlusResult<T, V>;
      }
      case "pointer": {
        return this.type.toValue(exp) as PlusResult<T, V>;
      }
    }
  }

  /** Returns the `-` binary expression between this variable's name and an integer value expression. */
  minus<V extends MinusValue<T>>(value: V) {
    if (this.type.kind === "pointer") {
      const resType =
        value.type.kind === "pointer" ? Simple.ptrDiff() : this.type;

      return Value.new(
        resType,
        Operator.minus(this.name(), value)
      ) as MinusResult<T, V>;
    }
    //
    else {
      return this.type.toValue(
        Operator.minus(this.name(), value)
      ) as MinusResult<T, V>;
    }
  }

  equal(value: TypeToAssignValue<T>) {
    return Value.bool(Operator.equal(this.name(), value));
  }

  /** Returns a bool value for the `>` expression between this variable's name and a value expression of the same type.  */
  greaterThan(value: TypeToAssignValue<T>) {
    return Value.bool(Operator.greaterThan(this.name(), value));
  }

  /**
   * Returns the smaller value expression using relational logical operators between this variable's name and another expression of the same type.
   */
  min(value: TypeToAssignValue<T>) {
    return Value.new(this.type, Utils.min(this.name(), value));
  }

  toString() {
    return this._name;
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

export type VarRefResult<T extends Simple | Pointer> = Value<Pointer<T>>;

export type VarDerefResult<T extends Simple | Pointer> = T extends Pointer<
  infer K
>
  ? K extends Simple | Pointer
    ? Value<K>
    : InvalidValue
  : InvalidValue;

export type PlusResult<
  T extends Simple | Pointer,
  V extends Value
> = T extends Pointer ? Value<T> : V extends Pointer ? Value<T> : NumberValue;

export type MinusValue<T extends Simple | Pointer> = T extends Pointer
  ? IntegerValue | Value<T>
  : NumberValue;

export type MinusResult<
  T extends Simple | Pointer,
  V extends Value
> = T extends Pointer
  ? V extends Value<infer VT>
    ? VT extends Pointer
      ? PointerDiffValue
      : NumberValue
    : InvalidValue
  : NumberValue;
