import { addressOf, assign, valueOf } from "./operators";
import type { AutoSpecifier, Pointer } from "./types";
import {
  increasePointerTypeLevel,
  removePointerStars,
  valueOfFull,
} from "./utils";
import { variable } from "./variable";

/** Simple pointers */
export const pointer = (type: AutoSpecifier, name: string): Pointer => {
  const addr = addressOf(name);

  return {
    name,
    type,
    declare: () => {
      return `${type} ${name}`;
    },
    value: () => valueOf(name),
    addr: () => addr,
    /** Simple aliasing of another pointer. */
    assignPointer: (pointerName: string) => {
      return assign(name, pointerName);
    },
    /** Assign any address to this pointer. */
    assignAddr: (address: string) => {
      return assign(name, address);
    },
    /** Create a variable to hold the fully dereferenced pointer value. */
    variable: (varName: string) => {
      const newType = removePointerStars(type);

      const newVar = variable(newType, varName);

      const deRefValue = valueOfFull(type, name);

      return {
        ...newVar,
        initPrevValue: () => {
          return assign(newVar.declare(), deRefValue);
        },
        assignPrevValue: () => {
          return assign(varName, deRefValue);
        },
      };
    },
    /** Create a pointer to increase the level of indirection. */
    pointer: (pointerName: string) => {
      const newType = increasePointerTypeLevel(type);

      const newPointer = pointer(newType, pointerName);

      return {
        ...newPointer,
        /** Initialize the pointer with the address of the pointer it came from. */
        initPrevAddr: () => {
          return assign(newPointer.declare(), addr);
        },
        /** Assign the address of the pointer this pointer came from. */
        assignPrevAddr: () => {
          return assign(pointerName, addr);
        },
      };
    },
  };
};
