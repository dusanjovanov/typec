import { BRANDING_MAP } from "./brand";
import type { ValArg } from "./types";
import { emptyFalsy, joinArgs } from "./utils";
import { Val } from "./val";

/** C preprocessor directives. */
export class Dir {
  constructor(desc: DirectiveDesc) {
    this.desc = desc;
  }
  kind = BRANDING_MAP.directive;
  desc;

  toString() {
    switch (this.desc.kind) {
      case "includeSys": {
        return `#include <${this.desc.path}>`;
      }
      case "includeRel": {
        return `#include "${this.desc.path}"`;
      }
      case "define": {
        return `#define ${this.desc.name}${emptyFalsy(
          this.desc.value,
          (v) => ` ${v}`
        )}`;
      }
      case "defineArgs": {
        return `#define ${this.desc.name}(${joinArgs(this.desc.args)}) (${
          this.desc.text
        })`;
      }
      case "undef": {
        return `#undef ${this.desc.name}`;
      }
      case "if": {
        return `#if ${this.desc.exp}`;
      }
      case "ifdef": {
        return `#ifdef ${this.desc.macro}`;
      }
      case "ifndef": {
        return `#ifndef ${this.desc.macro}`;
      }
      case "elif": {
        return `#elif ${this.desc.exp}`;
      }
      case "else": {
        return `#else`;
      }
      case "endif": {
        return `#endif`;
      }
      case "pragma": {
        return `#pragma ${this.desc.directive}`;
      }
    }
  }

  /** Generates an include directive for a system ( standard ) header file. `<>` */
  static includeSys(path: string) {
    return new Dir({ kind: "includeSys", path });
  }

  /** Generates an include directive for a relative ( project ) header file. `""` */
  static includeRel(path: string) {
    return new Dir({ kind: "includeRel", path });
  }

  static defineValue(name: string, value: ValArg | null) {
    return new Dir({
      kind: "define",
      name,
      value: value != null ? Val.valArgToVal(value) : value,
    });
  }

  static defineWithArgs(name: string, args: string[], text: string) {
    return new Dir({ kind: "defineArgs", name, args, text });
  }

  static undef(name: string) {
    return new Dir({ kind: "undef", name });
  }

  static if(exp: string) {
    return new Dir({
      kind: "if",
      exp,
    });
  }

  static ifdef(macro: ValArg) {
    return new Dir({ kind: "ifdef", macro: Val.valArgToVal(macro) });
  }

  static ifndef(macro: ValArg) {
    return new Dir({
      kind: "ifndef",
      macro: Val.valArgToVal(macro),
    });
  }

  static elif(exp: string) {
    return new Dir({
      kind: "elif",
      exp,
    });
  }

  static else() {
    return new Dir({
      kind: "else",
    });
  }

  static endif() {
    return new Dir({
      kind: "endif",
    });
  }

  static pragma(directive: string) {
    return new Dir({
      kind: "pragma",
      directive,
    });
  }
}

type DirectiveDesc =
  | IncludeSys
  | IncludeRel
  | Define
  | DefineArgs
  | Undef
  | IfDirective
  | IfDef
  | IfNotDef
  | ElIf
  | ElseDirective
  | EndIf
  | Pragma;

type IncludeSys = {
  kind: "includeSys";
  path: string;
};

type IncludeRel = {
  kind: "includeRel";
  path: string;
};

type Define = {
  kind: "define";
  name: string;
  value: Val | null;
};

type DefineArgs = {
  kind: "defineArgs";
  name: string;
  args: string[];
  text: string;
};

type Undef = {
  kind: "undef";
  name: string;
};

type IfDirective = {
  kind: "if";
  exp: string;
};

type IfDef = {
  kind: "ifdef";
  macro: Val;
};

type IfNotDef = {
  kind: "ifndef";
  macro: Val;
};

type ElIf = {
  kind: "elif";
  exp: string;
};

type ElseDirective = {
  kind: "else";
};

type EndIf = {
  kind: "endif";
};

type Pragma = {
  kind: "pragma";
  directive: string;
};
