import { Block } from "./chunk";
import { Operator } from "./operators";
import type { Param } from "./param";
import type {
  AutoSimpleType,
  GenericMembers,
  PointerQualifier,
  TypeArg,
  TypeQualifier,
} from "./types";
import {
  emptyFalsy,
  join,
  joinArgs,
  stringSplice,
  typeArgToType,
} from "./utils";

/** Used for generating C type syntax. */
export class Type<S extends string> {
  constructor(desc: TypeDescription<S>) {
    this.desc = desc;
    this.str = this.createTypeStr() as any;
  }
  kind = "type" as const;
  desc;
  str: string;

  /** Create a pointer type to this type. */
  pointer(qualifiers?: PointerQualifier[]) {
    return Type.pointer(this, qualifiers) as unknown as Type<`${S}*`>;
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

  /**
   * Returns a variable / parameter named declaration.
   */
  declare(name: string): string {
    return this.createTypeStr(name) as string;
  }

  toString() {
    return this.str;
  }

  static simple<S extends AutoSimpleType>(
    specifier: S,
    qualifiers: TypeQualifier[] = []
  ) {
    return Type.new({ kind: "simple", specifier, qualifiers });
  }

  /** Used for creating an api for a c library type alias. */
  static alias<S extends AutoSimpleType>(
    specifier: S,
    qualifiers: TypeQualifier[] = []
  ) {
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

  static pointer<S extends string>(
    type: TypeArg<S>,
    qualifiers: PointerQualifier[] = []
  ) {
    return Type.new({
      kind: "pointer",
      type: typeArgToType(type),
      qualifiers,
    }) as unknown as Type<`${S}*`>;
  }

  /** `char*` */
  static string(
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return Type.char(typeQualifiers).pointer(pointerQualifiers);
  }

  static array<S extends string>(
    elementType: Type<S>,
    length: number | number[] | undefined = undefined
  ) {
    return Type.new({ kind: "array", elementType, length });
  }

  static func<Return extends string>(
    returnType: Type<Return>,
    params: Param<any, any>[],
    hasVarArgs = false
  ) {
    return Type.new({ kind: "func", returnType, params, hasVarArgs });
  }

  static struct<Name extends string>(
    name: Name,
    qualifiers: TypeQualifier[] = []
  ) {
    return Type.new({ kind: "struct", name, qualifiers });
  }

  static union<Name extends string>(
    name: Name,
    members: GenericMembers,
    qualifiers: TypeQualifier[] = []
  ) {
    return Type.new({ kind: "union", name, members, qualifiers });
  }

  static enum<Name extends string>(
    name: Name,
    qualifiers: TypeQualifier[] = []
  ) {
    return Type.new({ kind: "enum", name, qualifiers });
  }

  static new<S extends string = any>(desc: TypeDescription<S>) {
    return new Type(desc);
  }

  /** Generates a block of struct or union members. */
  static membersBlock(members: GenericMembers) {
    return Block.new(
      ...Object.entries(members).map(([name, type]) => `${type} ${name}`)
    );
  }

  private qualifiersBefore(
    desc: Exclude<TypeDescription<any>, ArrayType<any> | FuncType<any>>
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
          return `${retStr}${this.nameAfter(name)}(void)`;
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

            return `${stringSplice(
              desc.type.str,
              index,
              `*${emptyFalsy(desc.qualifiers, (q) => `${join(q)}`)}`
            )}${this.nameAfter(name)}`;
          }
        }
      }
    }
  }
}

export type TypeDescription<S extends string> =
  | Simple<S>
  | Pointer<S>
  | ArrayType<S>
  | FuncType<S>
  | StructType<S>
  | EnumType<S>
  | UnionType<S>;

export type Simple<S extends string> = {
  kind: "simple";
  specifier: S;
  qualifiers: TypeQualifier[];
};

export type Pointer<S extends string> = {
  kind: "pointer";
  type: Type<S>;
  qualifiers: PointerQualifier[];
};

export type ArrayType<S extends string> = {
  kind: "array";
  elementType: Type<S>;
  length?: number | number[];
};

export type FuncType<S extends string> = {
  kind: "func";
  returnType: Type<S>;
  params: Param<any, any>[];
  hasVarArgs: boolean;
};

export type StructType<Name extends string> = {
  kind: "struct";
  name: Name | null;
  qualifiers: TypeQualifier[];
};

export type UnionType<Name extends string> = {
  kind: "union";
  name: Name | null;
  members: GenericMembers;
  qualifiers: TypeQualifier[];
};

export type EnumType<Name extends string> = {
  kind: "enum";
  name: Name;
  qualifiers: TypeQualifier[];
};
