import { Lit } from "./literal";
import { RValue } from "./rValue";
import { Type } from "./type";
import type { CodeLike, Numberish, TypeArg } from "./types";

/**
 * A value container containing an `rvalue` expression with helpers for generating all C literal and initializer expressions
 * and other, more complex, expressions that include it.
 */
export class Val<S extends string> extends RValue<S> {
  constructor(type: TypeArg<S>, valueExp: CodeLike) {
    super(type, valueExp);
  }
  kind = "value" as const;

  /**
   * Returns a Val for an int literal.
   */
  static int(n: CodeLike) {
    return Val.new(Type.int(), n);
  }

  /**
   * Returns a Val for a string literal.
   *
   * `"abc"`
   */
  static str(s: string) {
    return Val.new(Type.string(), Lit.str(s));
  }

  /**
   * Returns a Val for a multiline string literal.
   *
   * Same as `string`, but for multiple strings each on a new line.
   */
  static strMulti(...strings: string[]) {
    return Val.new(Type.string(), Lit.strMulti(...strings));
  }

  /**
   * Returns a Val for a char literal.
   *
   * `'a'`
   */
  static char(c: string) {
    return Val.new(Type.char(), Lit.char(c));
  }

  /**
   * Returns a Val for an unsigned integer literal.
   *
   * `23U`
   */
  static unsigned(n: Numberish) {
    return Val.new(Type.simple("unsigned int"), Lit.unsigned(n));
  }

  /**
   * Returns a Val for a long literal.
   *
   * `23L`
   */
  static longInt(n: Numberish) {
    return Val.new(Type.simple("long"), n);
  }

  /**
   * Returns a Val for an unsigned long literal.
   *
   * `23UL`
   */
  static unsignedLongInt(n: Numberish) {
    return Val.new(Type.simple("unsigned long"), n);
  }

  /**
   * Returns a Val for a long long literal.
   *
   * `23LL`
   */
  static longLongInt(n: Numberish) {
    return Val.new(Type.simple("long long"), Lit.longLongInt(n));
  }

  /**
   * Returns a Val for an unsigned long long literal.
   *
   * `23ULL`
   */
  static unsignedLongLongInt(n: Numberish) {
    return Val.new(
      Type.simple("unsigned long long"),
      Lit.unsignedLongLongInt(n)
    );
  }

  /**
   * Returns a Val for a float literal.
   *
   * `23.45F`
   */
  static float(n: Numberish) {
    return Val.new(Type.float(), Lit.float(n));
  }

  /**
   * Returns a Val for a long double literal.
   *
   * `23.45L`
   */
  static longDouble(n: Numberish) {
    return Val.new(Type.simple("long double"), Lit.longDouble(n));
  }

  /**
   * Returns a Val for a wide char literal.
   *
   * `L'a'`
   */
  static wideChar(c: Numberish) {
    return Val.new(Type.simple("wchar_t"), Lit.wideChar(c));
  }

  /**
   * Returns a Val for a compound literal expression.
   *
   * `{ "abc", 123, &var }`
   */
  static compound(...values: CodeLike[]) {
    return Val.new(Type.any(), Lit.compound(...values));
  }

  /**
   * Returns a Val for a struct or union designated dot initializer expression.
   *
   * `{ .a = 3, .b = &var, .c = "def" }`
   */
  static designatedDot(values: Partial<Record<string, CodeLike>>) {
    return Val.new(Type.any(), Lit.designatedDot(values));
  }

  /**
   * Returns a Val for an array designated subscript initializer expression.
   *
   * `{ [1] = 2, [3] = 5 }`
   */
  static designatedSub(values: Partial<Record<number, CodeLike>>) {
    return Val.new(Type.any(), Lit.designatedSub(values));
  }

  /**
   * Returns a Val for a union single value initializer expression.
   *
   * `{23}`
   */
  static singleMemberInit(value: CodeLike) {
    return Val.new(Type.any(), value);
  }

  /** Used for defining an api for using macro values. */
  static macro<S extends string = "any">(name: CodeLike, type?: TypeArg<S>) {
    return Val.new<S>(type ?? (Type.any() as any), name);
  }

  static new<S extends string>(type: TypeArg<S>, valueExp: CodeLike) {
    return new Val(type, valueExp);
  }
}
