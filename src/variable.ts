import { ref } from "./operators";
import type { VariableType } from "./type";

export class Variable {
  constructor(type: VariableType, name: string) {
    this.name = name;
    this.type = type;
    this.ref = ref(name);
  }
  name;
  type;
  ref;
}
