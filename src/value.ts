import type { AutoSimpleSpecifier, StringLike } from "./types";

export class Value<T extends AutoSimpleSpecifier> {
  constructor(type: T, value: StringLike) {
    this.type = type;
    this.value = value;
  }
  kind = "value" as const;
  type;
  value;

  toString() {
    return this.value;
  }

  static int(value: number) {
    return new Value("int", value);
  }

  static unsignedInt(value: number) {
    return new Value("unsigned int", value);
  }

  static short(value: number) {
    return new Value("short", value);
  }
}
