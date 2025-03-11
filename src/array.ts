import { addressOf, assign } from "./operators";
import { pointer } from "./pointer";
import { Type } from "./type";
import type { AutoSpecifier, StringLike } from "./types";
import { joinArgs, pointerStars } from "./utils";

export const arr = (elementType: AutoSpecifier, name: string, len: number) => {
  const arrAddr = addressOf(name);

  return {
    name,
    type: Type.arr(elementType, len),
    addr: () => arrAddr,
    /** Return the array declaration */
    declare: () => `${elementType} ${name}[${len}]`,
    /** Returns the array initialization */
    init: (value: StringLike[]) => {
      return assign(`${elementType} ${name}[]`, `{${joinArgs(value)}}`);
    },
    /** Pointer to the first element of array */
    pointer: (pointerName: string) => {
      return {
        ...pointer(Type.pointer(elementType), pointerName),
        declare: () => {
          return `${elementType} ${pointerName}`;
        },
        /** Assign the first element to the pointer */
        assignFirstAddr: () => {
          return assign(pointerName, name);
        },
      };
    },
    /** Pointer to the entire array */
    pointerArr: (pointerName: string) => {
      const declaration = `${elementType} (${pointerStars()}${name})[${len}]`;

      return {
        ...pointer(Type.arrPointer(elementType, len), pointerName),
        declare: () => {
          return declaration;
        },
        /** Initialize the pointer with the address of the entire array */
        init: () => {
          return assign(declaration, arrAddr);
        },
        /** Assign the address of the entire array to the pointer */
        assignArrAddr: () => {
          return assign(pointerName, arrAddr);
        },
      };
    },
  };
};
