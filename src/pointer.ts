import { value } from "./operators";
import type { PointerType } from "./type";

export class Pointer {
  constructor(type: PointerType, name: string) {
    this.name = name;
    this.type = type;
    this.value = value(name);
  }
  name;
  type;
  value;

  //
}
