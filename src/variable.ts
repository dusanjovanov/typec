import { addressOf, assign } from "./operators";
import { pointer } from "./pointer";
import { Type } from "./type";
import type { AutoSpecifier, StringLike, Variable } from "./types";

/** Simple values */
export const variable = (type: AutoSpecifier, name: string): Variable => {
  const addr = addressOf(name);

  return {
    name,
    type: type as string,
    declare: () => {
      return `${type} ${name}`;
    },
    addr: () => addr,
    assignVar: (varName: string) => {
      return assign(name, varName);
    },
    assignValue: (value: StringLike) => {
      return assign(name, value);
    },
    variable: (varName: string) => {
      const newVar = variable(type, varName);

      return {
        ...newVar,
        /** Initialize with the value of the previous variable. */
        initPrevValue: () => {
          return assign(newVar.declare(), name);
        },
        /** Assign the value of the previous variable. */
        assignPrevValue: () => {
          return assign(varName, name);
        },
      };
    },
    pointer: (pointerName: string) => {
      const newPointer = pointer(Type.pointer(type), pointerName);

      return {
        ...newPointer,
        /** Initialize with the address of the previous variable. */
        initPrevAddr: () => {
          return assign(newPointer.declare(), addr);
        },
        /** Assign the address of the previous variable. */
        assignPrevAddr: () => {
          return assign(pointerName, addr);
        },
      };
    },
  };
};
