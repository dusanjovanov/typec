import { Operator } from "./operators";
import { Pointer } from "./pointer";
import { Simple } from "./simple";
import type {
  PointerTypeQualifier,
  TypeQualifier,
  TypeToValueContainer,
} from "./types";

/** Used for declaring and initializing simple type and pointer variables. */
export class Var<T extends Simple | Pointer = any> {
  constructor(type: T, name: string) {
    this.type = type;
    this.name = name;
  }
  type;
  name;

  /** Returns the address of this variable's value. */
  address() {
    return this.type.toAddress(Operator.addressOf(this.name));
  }

  /** Returns the value of this variable. Dereferences if the type is a pointer. */
  value() {
    if (this.type instanceof Pointer) {
      return this.type.toValue(Operator.valueOf(this.name));
    }
    return this.type.toValue(this.name);
  }

  /** Returns the variable declaration statement. */
  declare() {
    return `${this.type.specifier} ${this.name}`;
  }

  /** Initialize with a value. */
  init(value: TypeToValueContainer<T>) {
    return Operator.assign(this.declare(), value);
  }

  /** Assign a value. */
  assign(value: TypeToValueContainer<T>) {
    return Operator.assign(this.name, value);
  }

  static new<T extends Simple | Pointer>(type: T, name: string) {
    return new Var(type, name);
  }

  static void(name: string, typeQualifiers?: TypeQualifier[]) {
    return Var.new(Simple.void(typeQualifiers), name);
  }

  static char(name: string, typeQualifiers?: TypeQualifier[]) {
    return Var.new(Simple.char(typeQualifiers), name);
  }

  static int(name: string, typeQualifiers?: TypeQualifier[]) {
    return Var.new(Simple.int(typeQualifiers), name);
  }

  /** Pointer variable for a char in a string. */
  static pointerString(
    name: string,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerTypeQualifier[]
  ) {
    return Var.new(Pointer.string(typeQualifiers, pointerQualifiers), name);
  }

  static pointerVoid(
    name: string,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerTypeQualifier[]
  ) {
    return Var.new(Pointer.void(typeQualifiers, pointerQualifiers), name);
  }

  static pointerChar(
    name: string,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerTypeQualifier[]
  ) {
    return Var.new(Pointer.char(typeQualifiers, pointerQualifiers), name);
  }

  static pointerInt(
    name: string,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerTypeQualifier[]
  ) {
    return Var.new(Pointer.int(typeQualifiers, pointerQualifiers), name);
  }
}
