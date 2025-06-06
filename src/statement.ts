import { BRANDING_MAP, isWhich } from "./brand";
import type { Cond } from "./condition";
import type { Dir } from "./directive";
import type { Switch } from "./switch";
import { Type } from "./type";
import type {
  GenericEnumValues,
  GenericMembers,
  StatArg,
  ValArg,
} from "./types";
import { curly, emptyNotFalse, memberTypeArgToType } from "./utils";
import { Val } from "./val";
import type { Var } from "./variable";

/** Used for creating statements. */
export class Stat {
  constructor(desc: Statement) {
    this.desc = desc;
  }
  desc;
  kind = BRANDING_MAP.stat;

  toString() {
    switch (this.desc.kind) {
      case "return": {
        return `return${emptyNotFalse(this.desc.value, (v) => ` ${v}`)};`;
      }
      case "while": {
        return `while(${this.desc.cond})${Stat.block(this.desc.statements)}`;
      }
      case "for": {
        return `for(${this.desc.init}${this.desc.cond};${
          this.desc.iter
        })${Stat.block(this.desc.statements)}`;
      }
      case "dowhile": {
        return `do${Stat.block(this.desc.statements)}while(${this.desc.cond})`;
      }
      case "varDeclaration": {
        return `${this.desc.type.declare(this.desc.name)};`;
      }
      case "paramDeclaration": {
        return `${this.desc.type.declare(this.desc.name)}`;
      }
      case "varInit": {
        return `${this.desc.var.expType.declare(this.desc.var.name)}=${
          this.desc.value
        };`;
      }
      case "value": {
        return `${this.desc.value};`;
      }
      case "if": {
        return `if(${this.desc.cond})${Stat.block(this.desc.statements)}`;
      }
      case "elseif": {
        return `else if(${this.desc.cond})${Stat.block(this.desc.statements)}`;
      }
      case "else": {
        return `else${Stat.block(this.desc.statements)}`;
      }
      case "cond": {
        return this.desc.cond.toString();
      }
      case "case": {
        return `case ${this.desc.value}:${Stat.block(this.desc.statements)}`;
      }
      case "default": {
        return `default:${Stat.block(this.desc.statements)}`;
      }
      case "switch": {
        return this.desc.switch.toString();
      }
      case "funcDeclaration": {
        return `${this.desc.type.declare(this.desc.name)};`;
      }
      case "funcDef": {
        return `${this.desc.type.declare(this.desc.name)}${Stat.block(
          this.desc.statements
        )}`;
      }
      case "struct": {
        return `struct ${this.desc.name}${Stat.block(this.desc.statements)};`;
      }
      case "union": {
        return `union ${this.desc.name}${Stat.block(this.desc.statements)};`;
      }
      case "enumValue": {
        if (this.desc.value == null) {
          return `${this.desc.name},`;
        }
        return `${this.desc.name}=${this.desc.value},`;
      }
      case "enum": {
        return `enum ${this.desc.name}${Stat.block(this.desc.statements)};`;
      }
      case "manual": {
        return this.desc.code;
      }
      case "directive": {
        return this.desc.directive.toString();
      }
    }
  }

  /** Helper to add new lines between statements which represent a chunk of code, but not necessarily a block ( chunk with curly braces ). */
  static chunk(statements: StatArg[]): string {
    return statements.map((s) => Stat.statArgToStat(s)).join(`\n`);
  }

  /** Helper for creating a curly braces enclosed block containing the passed statements. */
  static block(statements: StatArg[]) {
    return `\n${curly(`\n${Stat.chunk(statements)}\n`)}`;
  }

  static statArgToStat(arg: StatArg): Stat {
    if (isWhich("stat", arg)) {
      return arg;
    }
    //
    else if (isWhich("val", arg)) {
      return new Stat({ kind: "value", value: arg });
    }
    //
    else if (isWhich("cond", arg)) {
      return new Stat({ kind: "cond", cond: arg });
    }
    //
    else if (isWhich("switch", arg)) {
      return new Stat({ kind: "switch", switch: arg });
    }
    //
    else if (isWhich("func", arg)) {
      return arg.define();
    }
    //
    else if (isWhich("struct", arg)) {
      return arg.declare();
    }
    //
    else if (isWhich("union", arg)) {
      return arg.declare();
    }
    //
    else if (isWhich("enum", arg)) {
      return arg.declare();
    }
    //
    else if (isWhich("directive", arg)) {
      return new Stat({ kind: "directive", directive: arg });
    }
    // keep TS happy
    else {
      return new Stat({ kind: "value", value: arg });
    }
  }

  /** Returns a while loop statement. */
  static while(condition: ValArg, statements: StatArg[]) {
    return new Stat({
      kind: "while",
      cond: Val.valArgToVal(condition),
      statements: statements.map((s) => Stat.statArgToStat(s)),
    });
  }

  /** Returns a for loop statement. */
  static for(init: StatArg, cond: ValArg, iter: ValArg, statements: StatArg[]) {
    return new Stat({
      kind: "for",
      init: Stat.statArgToStat(init),
      cond: Val.valArgToVal(cond),
      iter: Val.valArgToVal(iter),
      statements: statements.map((s) => Stat.statArgToStat(s)),
    });
  }

  /** Returns a do while loop statement. */
  static doWhile(statements: StatArg[], condition: ValArg) {
    return new Stat({
      kind: "dowhile",
      cond: Val.valArgToVal(condition),
      statements: statements.map((s) => Stat.statArgToStat(s)),
    });
  }

  static if(condition: ValArg, statements: StatArg[]) {
    return new Stat({
      kind: "if",
      cond: Val.valArgToVal(condition),
      statements: statements.map((s) => Stat.statArgToStat(s)),
    });
  }

  static elseif(condition: ValArg, statements: StatArg[]) {
    return new Stat({
      kind: "elseif",
      cond: Val.valArgToVal(condition),
      statements: statements.map((s) => Stat.statArgToStat(s)),
    });
  }

  static else(statements: StatArg[]) {
    return new Stat({
      kind: "else",
      statements: statements.map((s) => Stat.statArgToStat(s)),
    });
  }

  static case(value: ValArg, statements: StatArg[]) {
    return new Stat({
      kind: "case",
      value: Val.valArgToVal(value),
      statements: statements.map((s) => Stat.statArgToStat(s)),
    });
  }

  static default(statements: StatArg[]) {
    return new Stat({
      kind: "default",
      statements: statements.map((s) => Stat.statArgToStat(s)),
    });
  }

  static varDeclaration(type: Type, name: string) {
    return new Stat({
      kind: "varDeclaration",
      type,
      name,
    });
  }

  static varInit(variable: Var, value: ValArg) {
    return new Stat({
      kind: "varInit",
      var: variable,
      value: Val.valArgToVal(value),
    });
  }

  /** Returns a parameter declaration statement. */
  static paramDeclaration(type: Type, name: string) {
    return new Stat({
      kind: "paramDeclaration",
      type,
      name,
    });
  }

  /** Returns a function declaration statement. */
  static funcDeclaration(type: Type, name: string) {
    return new Stat({
      kind: "funcDeclaration",
      type,
      name,
    });
  }

  /** Returns a function definition statement. */
  static funcDef(type: Type, name: string, statements: StatArg[]) {
    return new Stat({
      kind: "funcDef",
      type,
      name,
      statements: statements.map((s) => Stat.statArgToStat(s)),
    });
  }

  /** Returns a function return statement. */
  static return(value?: ValArg) {
    return new Stat({
      kind: "return",
      value: value == null ? value ?? null : Val.valArgToVal(value),
    });
  }

  static struct(name: string, members: GenericMembers) {
    return new Stat({
      kind: "struct",
      name,
      statements: Stat.memberStatements(members),
    });
  }

  static union(name: string, members: GenericMembers) {
    return new Stat({
      kind: "union",
      name,
      statements: Stat.memberStatements(members),
    });
  }

  static enum(name: string, values: GenericEnumValues) {
    return new Stat({
      kind: "enum",
      name,
      statements: Object.entries(values).map(([name, value]) => {
        return new Stat({
          kind: "enumValue",
          name,
          value: value == null ? value : Val.valArgToVal(value),
        });
      }),
    });
  }

  static manual(code: string) {
    return new Stat({
      kind: "manual",
      code,
    });
  }

  static memberStatements(members: GenericMembers): Stat[] {
    return Object.entries(members).map(([key, value]) => {
      return Stat.varDeclaration(memberTypeArgToType(value), key);
    });
  }
}

type Statement =
  | ValueStatement
  | ReturnStatement
  | WhileStatement
  | ForStatement
  | DoWhileStatement
  | VarInitStatement
  | IfStatement
  | ElseIfStatement
  | ElseStatement
  | CondStatement
  | SwitchStatement
  | CaseStatement
  | DefaultStatement
  | FuncDeclarationStatement
  | FuncDefinitionStatement
  | StructStatement
  | UnionStatement
  | VarDeclarationStatement
  | ParamDeclarationStatement
  | EnumStatement
  | EnumValueStatement
  | ManualStatement
  | DirectiveStatement;

type ReturnStatement = {
  kind: "return";
  value: Val | null;
};

type WhileStatement = {
  kind: "while";
  cond: Val;
  statements: Stat[];
};

type ForStatement = {
  kind: "for";
  init: Stat;
  cond: Val;
  iter: Val;
  statements: Stat[];
};

type DoWhileStatement = {
  kind: "dowhile";
  cond: Val;
  statements: Stat[];
};

type ValueStatement = {
  kind: "value";
  value: Val;
};

type IfStatement = {
  kind: "if";
  cond: Val;
  statements: Stat[];
};

type ElseIfStatement = {
  kind: "elseif";
  cond: Val;
  statements: Stat[];
};

type ElseStatement = {
  kind: "else";
  statements: Stat[];
};

type CondStatement = {
  kind: "cond";
  cond: Cond;
};

type SwitchStatement = {
  kind: "switch";
  switch: Switch;
};

type CaseStatement = {
  kind: "case";
  value: Val;
  statements: Stat[];
};

type DefaultStatement = {
  kind: "default";
  statements: Stat[];
};

type VarDeclarationStatement = {
  kind: "varDeclaration";
  type: Type;
  name: string;
};

type VarInitStatement = {
  kind: "varInit";
  var: Var;
  value: Val;
};

type ParamDeclarationStatement = {
  kind: "paramDeclaration";
  type: Type;
  name: string;
};

type FuncDeclarationStatement = {
  kind: "funcDeclaration";
  type: Type;
  name: string;
};

type FuncDefinitionStatement = {
  kind: "funcDef";
  type: Type;
  name: string;
  statements: Stat[];
};

type StructStatement = {
  kind: "struct";
  name: string;
  statements: Stat[];
};

type UnionStatement = {
  kind: "union";
  name: string;
  statements: Stat[];
};

type EnumStatement = {
  kind: "enum";
  name: string;
  statements: Stat[];
};

type EnumValueStatement = {
  kind: "enumValue";
  name: string;
  value: Val | null;
};

type ManualStatement = {
  kind: "manual";
  code: string;
};

type DirectiveStatement = {
  kind: "directive";
  directive: Dir;
};
