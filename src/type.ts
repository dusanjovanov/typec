import { Block } from "./chunk";
import { Operator } from "./operators";
import { Param } from "./param";
import type {
  AutoSimpleType,
  Members,
  PointerQualifier,
  TypeQualifier,
} from "./types";
import { emptyFalsy, join, joinArgs, stringSplice } from "./utils";

/** Used for generating C type syntax. */
export class Type {
  constructor(desc: TypeDescription) {
    this.desc = desc;
    this.str = this.createTypeStr();
  }
  desc;
  str: string;

  /** Create a pointer type to this type. */
  pointer(qualifiers?: PointerQualifier[]) {
    return Type.pointer(this, qualifiers);
  }

  /** Returns a new Type with the `const` modifier added to the type. */
  const() {
    if ("qualifiers" in this.desc) {
      return Type.new({
        ...this.desc,
        qualifiers: [...(this.desc.qualifiers as any[]), "const"],
      });
    }
    return this;
  }

  sizeOf() {
    return Operator.sizeOf(this);
  }

  param<Name extends string>(name: Name) {
    return Param.new(this, name);
  }

  /**
   * Returns a variable / parameter named declaration.
   */
  declare(name: string): string {
    return this.createTypeStr(name);
  }

  toString() {
    return this.str;
  }

  static simple(specifier: AutoSimpleType, qualifiers: TypeQualifier[] = []) {
    return Type.new({ kind: "simple", specifier, qualifiers });
  }

  /** Used for creating an api for a c library type alias. */
  static alias(specifier: AutoSimpleType, qualifiers: TypeQualifier[] = []) {
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

  /** `char*` */
  static string(
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Type.char(typeQualifiers).pointer(pointerQualifiers);
  }

  static array(
    elementType: Type,
    length: number | number[] | undefined = undefined
  ) {
    return Type.new({ kind: "array", elementType, length });
  }

  static func(returnType: Type, params: Param[], hasVarArgs = false) {
    return Type.new({ kind: "func", returnType, params, hasVarArgs });
  }

  static struct(name: string | null, qualifiers: TypeQualifier[] = []) {
    return Type.new({ kind: "struct", name, qualifiers });
  }

  static union(
    name: string | null,
    members: Members,
    qualifiers: TypeQualifier[] = []
  ) {
    return Type.new({ kind: "union", name, members, qualifiers });
  }

  static enum(name: string, qualifiers: TypeQualifier[] = []) {
    return Type.new({ kind: "enum", name, qualifiers });
  }

  static new(desc: TypeDescription) {
    return new Type(desc);
  }

  /** Generates a block of struct or union members. */
  static membersBlock(members: Members) {
    return Block.new(
      ...Object.entries(members).map(([name, type]) => `${type} ${name}`)
    );
  }

  private qualifiersBefore(
    desc: Exclude<TypeDescription, ArrayType | FuncType>
  ) {
    return emptyFalsy(desc.qualifiers, (q) => `${join(q)} `);
  }

  private nameAfter(name?: string) {
    return emptyFalsy(name, (n) => ` ${n}`);
  }

  private createTypeStr(name?: string) {
    const desc = this.desc;

    switch (desc.kind) {
      case "simple": {
        return `${this.qualifiersBefore(desc)}${desc.specifier}${this.nameAfter(
          name
        )}`;
      }
      case "array": {
        let str = `${desc.elementType}${this.nameAfter(name)}`;

        if (desc.length == null) {
          str += "[]";
        }
        //
        else if (Array.isArray(desc.length)) {
          str += desc.length.map((l) => `[${l}]`).join("");
        }
        //
        else {
          str += `[${desc.length}]`;
        }

        return str;
      }
      case "func": {
        const retStr = desc.returnType.str;

        if (desc.params.length === 0) {
          return `${retStr} (void)`;
        }
        //
        else {
          return `${retStr}${this.nameAfter(name)}(${joinArgs(
            desc.params.map((p) => p.declare())
          )}${emptyFalsy(
            desc.hasVarArgs === false ? null : desc.hasVarArgs,
            () => `,...`
          )})`;
        }
      }
      case "struct": {
        return `${this.qualifiersBefore(desc)}struct ${
          desc.name
        }${this.nameAfter(name)}`;
      }
      case "union": {
        if (desc.name == null) {
          return `union ${Type.membersBlock(desc.members)}`;
        }
        return `${this.qualifiersBefore(desc)}union ${
          desc.name
        }${this.nameAfter(name)}`;
      }
      case "enum": {
        return `${this.qualifiersBefore(desc)}enum ${desc.name}${this.nameAfter(
          name
        )}`;
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
            )}${this.nameAfter(name)}`;
          }
          case "array": {
            return stringSplice(
              desc.type.str,
              desc.type.str.indexOf("["),
              `(*${emptyFalsy(
                desc.qualifiers,
                (q) => `${join(q)}`
              )}${this.nameAfter(name)})`
            );
          }
          case "func": {
            return stringSplice(
              desc.type.str,
              desc.type.str.indexOf("("),
              `(*${emptyFalsy(
                desc.qualifiers,
                (q) => `${join(q)}`
              )}${this.nameAfter(name)})`
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
              `*${emptyFalsy(
                desc.qualifiers,
                (q) => `${join(q)}`
              )}${this.nameAfter(name)}`
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
  params: Param[];
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
  members: Members;
  qualifiers: TypeQualifier[];
};

export type EnumType = {
  kind: "enum";
  name: string;
  qualifiers: TypeQualifier[];
};
