import type {
  AutoPointerQualifier,
  AutoQualifier,
  AutoSpecifier,
} from "./types";
import { emptyFalsy, fillArray } from "./utils";

export const Type = {
  var(type: AutoSpecifier, qualifier?: AutoQualifier) {
    return new VariableType({ type, qualifier });
  },
  pointer(type: AutoSpecifier, qualifier?: AutoPointerQualifier) {
    return new PointerType({ type, qualifier });
  },
  struct(name: string) {
    return new StructType(name);
  },
};

export class VariableType {
  constructor({
    type,
    qualifier,
  }: {
    type: AutoSpecifier;
    qualifier?: AutoQualifier;
  }) {
    this.type = type;
    this.qualifier = qualifier;
    this.full = `${emptyFalsy(qualifier)}${type}`;
  }
  type;
  qualifier;
  full;
}

export class PointerType {
  constructor({
    type,
    qualifier,
    level = 1,
  }: {
    type: AutoSpecifier;
    qualifier?: AutoPointerQualifier;
    level?: number;
  }) {
    this.type = type;
    this.qualifier = qualifier;
    this.full = `${type}${fillArray(level, () => "*")}${emptyFalsy(
      qualifier,
      (q) => ` ${q}`
    )}`;
  }
  type;
  qualifier;
  full;
}

export class StructType {
  constructor(structName: string) {
    this.structName = structName;
    this.full = `struct ${structName}`;
  }
  structName;
  full;
}
