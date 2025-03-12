import { addressOf, assign, valueOf } from "./operators";

export class Pointer {
  constructor(type: string, name: string) {
    this.type = type;
    this.name = name;
  }
  type;
  name;

  addr() {
    return addressOf(this.name);
  }

  value() {
    return valueOf(this.name);
  }

  declare() {
    return `${this.type} ${this.name}`;
  }

  /** Simple aliasing of another pointer. */
  assignPointer(pointerName: string) {
    return assign(this.name, pointerName);
  }

  /** Assign an address to this pointer. */
  assignAddr(address: string) {
    return assign(this.name, address);
  }
}
