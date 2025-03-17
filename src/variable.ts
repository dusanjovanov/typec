import { Operator } from "./operators";
import { Pointer } from "./pointer";
import { Simple } from "./simple";
import type {
  PointerQualifier,
  TypeQualifier,
  TypeToAddress,
  TypeToValueContainer,
} from "./types";

/** Used for declaring and initializing simple type and pointer variables. */
export class Variable<T extends Simple | Pointer = any> {
  constructor(type: T, name: string) {
    this.type = type;
    this.name = name;
  }
  type;
  name;

  /** Returns the address of this variable. If the type is a pointer - it's just its name wrapped in an Address. */
  address() {
    if (this.type instanceof Pointer) {
      return this.type.toAddress(this.name) as TypeToAddress<T>;
    }
    return this.type.toAddress(
      Operator.addressOf(this.name)
    ) as TypeToAddress<T>;
  }

  /** Returns the value of this variable. If the type is a pointer - it's dereferenced. */
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

  minus(value: TypeToValueContainer<T>) {
    if (this.type instanceof Pointer) {
      return this.type.toAddress(
        Operator.minus(this.value(), value)
      ) as TypeToValueContainer<T>;
    }
    //
    else {
      return this.type.toValue(
        Operator.minus(this.value(), value)
      ) as TypeToValueContainer<T>;
    }
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

  /** Pointer variable for a char in a string. */
  static pointerString(
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

  static pointerChar(
    name: string,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Variable.new(Pointer.char(typeQualifiers, pointerQualifiers), name);
  }

  static pointerInt(
    name: string,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Variable.new(Pointer.int(typeQualifiers, pointerQualifiers), name);
  }
}
