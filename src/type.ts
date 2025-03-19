import type { AutoSimpleType, PointerQualifier, TypeQualifier } from "./types";
import { emptyFalsy, join, joinArgs, stringSplice } from "./utils";

/** Used for generating C type syntax. */
export class Type {
  constructor(desc: TypeDescription) {
    this.desc = desc;

    this.full = "";

    switch (desc.kind) {
      case "simple": {
        this.full = `${emptyFalsy(desc.qualifiers, (q) => `${join(q)} `)}${
          desc.specifier
        }`;
        break;
      }
      case "pointer": {
        switch (desc.type.desc.kind) {
          case "simple": {
            this.full = `${desc.type.full}*${emptyFalsy(
              desc.qualifiers,
              (q) => ` ${join(q)}`
            )}`;
            break;
          }
          case "array": {
            this.full = stringSplice(
              desc.type.full,
              desc.type.full.indexOf("["),
              `(*${emptyFalsy(desc.qualifiers, (q) => `${join(q)}`)})`
            );
            break;
          }
          case "func": {
            this.full = stringSplice(
              desc.type.full,
              desc.type.full.indexOf("("),
              "(*)"
            );
            break;
          }
          case "pointer": {
            this.full = stringSplice(
              desc.type.full,
              desc.type.full.indexOf("*"),
              "*"
            );
            break;
          }
        }
        break;
      }
      case "array": {
        this.full = `${desc.elementType.full} [${desc.length}]`;
        break;
      }
      case "func": {
        this.full = `${desc.returnType.full} (${joinArgs(
          desc.paramTypes.map((p) => p.full)
        )}${emptyFalsy(
          desc.hasVarArgs,
          (v) => `,${(v as any).type.specifier}`
        )})`;
        break;
      }
      case "struct": {
        this.full = `struct ${desc.name}`;
        break;
      }
    }
  }
  desc;
  full: string;

  /** Create a pointer to this type. */
  pointer(qualifiers?: PointerQualifier[]) {
    return Type.pointer(this, qualifiers);
  }

  toString() {
    return this.full;
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
  static ptrDiff(qualifiers?: TypeQualifier[]) {
    return Type.simple("ptrdiff_t", qualifiers);
  }

  static short(qualifiers?: TypeQualifier[]) {
    return Type.simple("short", qualifiers);
  }

  static pointer(type: Type, qualifiers: PointerQualifier[] = []) {
    return Type.new({ kind: "pointer", type, qualifiers });
  }

  static simplePtr(
    specifier: AutoSimpleType,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Type.pointer(
      Type.simple(specifier, typeQualifiers),
      pointerQualifiers
    );
  }

  static string(
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Type.simplePtr("char", typeQualifiers, pointerQualifiers);
  }

  static ptrInt(
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Type.simplePtr("int", typeQualifiers, pointerQualifiers);
  }

  static ptrVoid(
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Type.simplePtr("void", typeQualifiers, pointerQualifiers);
  }

  static array(elementType: Type, length: number) {
    return Type.new({ kind: "array", elementType, length });
  }

  static func(returnType: Type, paramTypes: Type[], hasVarArgs = false) {
    return Type.new({ kind: "func", returnType, paramTypes, hasVarArgs });
  }

  static new(desc: TypeDescription) {
    return new Type(desc);
  }
}

export type TypeDescription =
  | SimpleTypeDescription
  | PointerTypeDescription
  | ArrayTypeDescription
  | FuncTypeDescription
  | StructTypeDescription;

export type SimpleTypeDescription = {
  kind: "simple";
  specifier: string;
  qualifiers: TypeQualifier[];
};

export type PointerTypeDescription = {
  kind: "pointer";
  type: Type;
  qualifiers: PointerQualifier[];
};

export type ArrayTypeDescription = {
  kind: "array";
  elementType: Type;
  length: number;
};

export type FuncTypeDescription = {
  kind: "func";
  returnType: Type;
  paramTypes: Type[];
  hasVarArgs: boolean;
};

export type StructTypeDescription = {
  kind: "struct";
  name: string;
  qualifiers: TypeQualifier[];
};
