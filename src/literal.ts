import { curly } from "./chunk";
import type { CodeLike, Numberish } from "./types";
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
  static str(s: string) {
    return `"${s.replaceAll(/"/g, `\\"`)}"`;
  }

  /**
   * multiline string literal
   *
   * Same as `string`, but for multiple strings each on a new line.
   */
  static strMulti(...strings: string[]) {
    return strings.map((s) => Lit.str(s)).join("\n");
  }

  /**
   * Returns the same char string enclosed in single quotes and escapes the single quote char.
   *
   * `'a'`
   */
  static char(c: string) {
    return `'${c.replace(/'/g, `\\'`)}'`;
  }

  /**
   * Adds the unsinged suffix to an integer number.
   *
   * `23U`
   */
  static unsigned(n: Numberish) {
    return `${n}U`;
  }

  /**
   * Adds the long suffix to an integer number.
   *
   * `23L`
   */
  static longInt(n: Numberish) {
    return `${n}L`;
  }

  /**
   * Adds the unsigned and long suffixes to an integer number.
   *
   * `23UL`
   */
  static unsignedLongInt(n: Numberish) {
    return `${n}UL`;
  }

  /**
   * Adds the long long suffix to an integer number.
   *
   * `23LL`
   */
  static longLongInt(n: Numberish) {
    return `${n}LL`;
  }

  /**
   * Adds the unsigned and long long suffixes to an integer number.
   *
   * `23ULL`
   */
  static unsignedLongLongInt(n: Numberish) {
    return `${n}ULL`;
  }

  /**
   * Adds the float sufix to a floating point number.
   *
   * If an integer number is passed, it automatically adds a `.0F` at the end.
   *
   * `23.45F`
   */
  static float(n: Numberish) {
    return `${typeof n === "number" && n % 2 === 0 ? `${n}.0` : n}F`;
  }

  /**
   * Adds the long double sufix to a floating point number.
   *
   * `23.45L`
   */
  static longDouble(n: Numberish) {
    return `${n}L`;
  }

  /**
   * Returns the same char string enclosed in single quotes, escapes the single quote char, and adds an L in front of it.
   *
   * `L'a'`
   */
  static wideChar(c: Numberish) {
    return `L${Lit.char(String(c))}`;
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
   * Returns a struct designated initializer expression.
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
   * Returns an array designated initializer expression.
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

  /**
   * Returns a single value initializer expression used for unions.
   *
   * `{23}`
   */
  static singleMemberInit(value: CodeLike) {
    return curly(value);
  }
}
