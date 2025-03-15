import { curly } from "./chunk";
import type { PassingValue } from "./types";
import { joinArgs } from "./utils";

export class Literal {
  /**
   * Returns the same string enclosed in double quotes with double quotes inside the string escaped.
   *
   * `"abc"`
   */
  static string(str: string) {
    return `"${str.replaceAll(/"/g, `\"`)}"`;
  }

  /**
   * Returns the same char string enclosed in single quotes and escapes the single quote char.
   *
   * `'a'`
   */
  static char(char: string) {
    return `'${char.replace(/'/g, `\'`)}'`;
  }

  /**
   * Returns the same char string enclosed in single quotes, escapes the single quote char, and adds an L in front of it.
   *
   * `L'a'`
   */
  static wideChar(char: string) {
    return `L${Literal.char(char)}`;
  }

  /**
   * Returns a compound literal expression.
   *
   * `{ 'abc', 123, &var }`
   */
  static compound(values: PassingValue[]) {
    return curly(joinArgs(values));
  }
}
