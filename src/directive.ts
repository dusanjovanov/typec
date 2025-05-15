import { Chunk } from "./chunk";
import type { CodeLike } from "./types";
import { joinArgs } from "./utils";

/** C preprocessor directives. */
export class Dir {
  static defineValue(name: string, value: CodeLike) {
    return `#define ${name} ${value}`;
  }

  static defineWithArgs(name: string, args: string[], body: CodeLike) {
    return `#define ${name}(${joinArgs(args)}) (${body})`;
  }

  static undef(name: string) {
    return `#undef ${name}`;
  }

  static includeRelative(name: string) {
    return `#include "${name}"`;
  }

  static includeSystem(name: string) {
    return `#include <${name}>`;
  }

  static if(condition: CodeLike, body: CodeLike[]) {
    return new ConditionalDirective("if", condition, body);
  }

  static ifdef(condition: CodeLike, body: CodeLike[]) {
    return new ConditionalDirective("ifdef", condition, body);
  }

  static ifndef(condition: CodeLike, body: CodeLike[]) {
    return new ConditionalDirective("ifndef", condition, body);
  }

  static pragma(directive: CodeLike) {
    return `#pragma ${directive}`;
  }
}

export class ConditionalDirective {
  constructor(
    directive: "if" | "ifdef" | "ifndef",
    condition: CodeLike,
    body: CodeLike[]
  ) {
    this.statements.push(`#${directive} ${condition}${Chunk.new(...body)}`);
  }
  kind = "conditionDirective" as const;
  statements: CodeLike[] = [];

  elif(condition: CodeLike, body: CodeLike[]) {
    this.statements.push(`#elif ${condition}${Chunk.new(...body)}`);
  }

  else(body: CodeLike[]) {
    this.statements.push(`#else${Chunk.new(...body)}`);
  }

  end() {
    return this.statements.push(`#endif`);
  }

  toString() {
    return Chunk.new(...this.statements).toString();
  }
}
