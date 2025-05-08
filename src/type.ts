import type { AutoSimpleType, PointerQualifier, TypeQualifier } from "./types";
import { emptyFalsy, join, joinArgs, stringSplice } from "./utils";

/** Used for generating C type syntax. */
export class Type {
  constructor(desc: TypeDescription) {
    this.desc = desc;
    this.str = this.createTypeStr();
  }
  desc;
  str: string;

  /** Create a pointer to this type. */
  pointer(qualifiers?: PointerQualifier[]) {
    return Type.pointer(this, qualifiers);
  }

  toString() {
    return this.str;
  }

  static simple(specifier: AutoSimpleType, qualifiers: TypeQualifier[] = []) {
    return Type.new({ kind: "simple", specifier, qualifiers });
  }

  static int(qualifiers?: TypeQualifier[]) {
    return Type.simple("int", qualifiers);
  }

  static size_t(qualifiers?: TypeQualifier[]) {
    return Type.simple("size_t", qualifiers);
  }

  static void(qualifiers?: TypeQualifier[]) {
    return Type.simple("void", qualifiers);
  }

  static char(qualifiers?: TypeQualifier[]) {
    return Type.simple("char", qualifiers);
  }

  /** integer type `ptrdiff_t` */
  static ptrdiff_t(qualifiers?: TypeQualifier[]) {
    return Type.simple("ptrdiff_t", qualifiers);
  }

  static short(qualifiers?: TypeQualifier[]) {
    return Type.simple("short", qualifiers);
  }

  static bool(qualifiers?: TypeQualifier[]) {
    return Type.simple("bool", qualifiers);
  }

  static double(qualifiers?: TypeQualifier[]) {
    return Type.simple("double", qualifiers);
  }

  static float(qualifiers?: TypeQualifier[]) {
    return Type.simple("float", qualifiers);
  }

  static pointer(type: Type, qualifiers: PointerQualifier[] = []) {
    return Type.new({ kind: "pointer", type, qualifiers });
  }

  static simplePointer(
    specifier: AutoSimpleType,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Type.pointer(
      Type.simple(specifier, typeQualifiers),
      pointerQualifiers
    );
  }

  /** `char*` */
  static string(
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Type.simplePointer("char", typeQualifiers, pointerQualifiers);
  }

  static intPointer(
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Type.simplePointer("int", typeQualifiers, pointerQualifiers);
  }

  static voidPointer(
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Type.simplePointer("void", typeQualifiers, pointerQualifiers);
  }

  static floatPointer(
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Type.simplePointer("float", typeQualifiers, pointerQualifiers);
  }

  static array(
    elementType: Type,
    length: number | number[] | undefined = undefined
  ) {
    return Type.new({ kind: "array", elementType, length });
  }

  static func(returnType: Type, paramTypes: Type[], hasVarArgs = false) {
    return Type.new({ kind: "func", returnType, paramTypes, hasVarArgs });
  }

  static struct(name: string | null, qualifiers: TypeQualifier[] = []) {
    return Type.new({ kind: "struct", name, qualifiers });
  }

  static structPointer(
    name: string | null,
    typeQualifiers: TypeQualifier[] = [],
    pointerQualifiers: PointerQualifier[] = []
  ) {
    return Type.pointer(Type.struct(name, typeQualifiers), pointerQualifiers);
  }

  static union(name: string | null, qualifiers: TypeQualifier[] = []) {
    return Type.new({ kind: "union", name, qualifiers });
  }

  static unionPointer(
    name: string | null,
    typeQualifiers: TypeQualifier[] = [],
    pointerQualifiers: PointerQualifier[] = []
  ) {
    return Type.pointer(Type.union(name, typeQualifiers), pointerQualifiers);
  }

  static enum(name: string, qualifiers: TypeQualifier[] = []) {
    return Type.new({ kind: "enum", name, qualifiers });
  }

  static enumPointer(
    name: string,
    typeQualifiers: TypeQualifier[] = [],
    pointerQualifiers: PointerQualifier[] = []
  ) {
    return Type.pointer(Type.enum(name, typeQualifiers), pointerQualifiers);
  }

  static new(desc: TypeDescription) {
    return new Type(desc);
  }

  private qualifiersBefore(
    desc: Exclude<TypeDescription, ArrayType | FuncType>
  ) {
    return emptyFalsy(desc.qualifiers, (q) => `${join(q)} `);
  }

  private createTypeStr() {
    const desc = this.desc;

    switch (desc.kind) {
      case "simple": {
        return `${this.qualifiersBefore(desc)}${desc.specifier}`;
      }
      case "array": {
        return `${desc.elementType.str} [${desc.length}]`;
      }
      case "func": {
        const retStr = desc.returnType.str;

        if (desc.paramTypes.length === 0) {
          return `${retStr} (void)`;
        }
        //
        else {
          return `${retStr} (${joinArgs(desc.paramTypes)}${emptyFalsy(
            desc.hasVarArgs,
            () => `,...`
          )})`;
        }
      }
      case "struct": {
        return `${emptyFalsy(this.qualifiersBefore(desc))}struct ${desc.name}`;
      }
      case "union": {
        return `${emptyFalsy(this.qualifiersBefore(desc))}union ${desc.name}`;
      }
      case "enum": {
        return `${this.qualifiersBefore(desc)}enum ${desc.name}`;
      }
      case "pointer": {
        switch (desc.type.desc.kind) {
          case "simple":
          case "struct":
          case "union":
          case "enum": {
            return `${desc.type.str}*${emptyFalsy(
              desc.qualifiers,
              (q) => ` ${join(q)}`
            )}`;
          }
          case "array": {
            return stringSplice(
              desc.type.str,
              desc.type.str.indexOf("["),
              `(*${emptyFalsy(desc.qualifiers, (q) => `${join(q)}`)})`
            );
          }
          case "func": {
            return stringSplice(
              desc.type.str,
              desc.type.str.indexOf("("),
              `(*${emptyFalsy(desc.qualifiers, (q) => `${join(q)}`)})`
            );
          }
          case "pointer": {
            let index = desc.type.str.indexOf("*");

            switch (desc.type.desc.type.desc.kind) {
              case "func": {
                index = desc.type.str.indexOf(")");
                break;
              }
              case "array": {
                index = desc.type.str.indexOf(")");
                break;
              }
            }

            return stringSplice(
              desc.type.str,
              index,
              `*${emptyFalsy(desc.qualifiers, (q) => `${join(q)}`)}`
            );
          }
        }
      }
    }
  }
}

export type TypeDescription =
  | Simple
  | Pointer
  | ArrayType
  | FuncType
  | StructType
  | EnumType
  | UnionType;

export type Simple = {
  kind: "simple";
  specifier: string;
  qualifiers: TypeQualifier[];
};

export type Pointer = {
  kind: "pointer";
  type: Type;
  qualifiers: PointerQualifier[];
};

export type ArrayType = {
  kind: "array";
  elementType: Type;
  length?: number | number[];
};

export type FuncType = {
  kind: "func";
  returnType: Type;
  paramTypes: Type[];
  hasVarArgs: boolean;
};

export type StructType = {
  kind: "struct";
  name: string | null;
  qualifiers: TypeQualifier[];
};

export type UnionType = {
  kind: "union";
  name: string | null;
  qualifiers: TypeQualifier[];
};

export type EnumType = {
  kind: "enum";
  name: string;
  qualifiers: TypeQualifier[];
};
