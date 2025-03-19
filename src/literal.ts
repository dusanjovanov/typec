import { curly } from "./chunk";
import type { CodeLike } from "./types";
import { joinArgs } from "./utils";

/** Helpers for creating C literals. */
export class Lit {
  /**
   * string literal
   *
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
   * Adds the unsinged suffix to an integer number.
   *
   * `23U`
   */
  static unsigned(value: number) {
    return `${value}U`;
  }

  /**
   * Adds the long suffix to an integer number.
   *
   * `23L`
   */
  static longInt(value: number) {
    return `${value}L`;
  }

  /**
   * Adds the unsigned and long suffixes to an integer number.
   *
   * `23UL`
   */
  static unsignedLongInt(value: number) {
    return `${value}UL`;
  }

  /**
   * Adds the long long suffix to an integer number.
   *
   * `23LL`
   */
  static longLongInt(value: number) {
    return `${value}LL`;
  }

  /**
   * Adds the unsigned and long long suffixes to an integer number.
   *
   * `23ULL`
   */
  static unsignedLongLongInt(value: number) {
    return `${value}ULL`;
  }

  /**
   * Adds the float sufix to a floating point number.
   *
   * `23.45F`
   */
  static float(value: number) {
    return `${value}F`;
  }

  /**
   * Adds the long double sufix to a floating point number.
   *
   * `23.45L`
   */
  static longDouble(value: number) {
    return `${value}L`;
  }

  /**
   * Returns the same char string enclosed in single quotes, escapes the single quote char, and adds an L in front of it.
   *
   * `L'a'`
   */
  static wideChar(char: string) {
    return `L${Lit.char(char)}`;
  }

  /**
   * Returns a compound literal expression.
   *
   * `{ "abc", 123, &var }`
   */
  static compound(...values: CodeLike[]) {
    return curly(joinArgs(values));
  }

  /**
   * Returns a struct ( dot ) designated initializer expression.
   *
   * `{ .a = 3, .b = &var, .c = "def" }`
   */
  static designatedDot(values: Partial<Record<string, CodeLike>>) {
    return curly(
      joinArgs(
        Object.entries(values).map(([name, value]) => `.${name}=${value}`)
      )
    );
  }

  /**
   * Returns an array ( subscript ) designated initializer expression.
   *
   * `{ [1] = 2, [3] = 5 }`
   */
  static designatedSub(values: Partial<Record<number, CodeLike>>) {
    return curly(
      joinArgs(
        Object.entries(values).map(([name, value]) => `[${name}]=${value}`)
      )
    );
  }
}
