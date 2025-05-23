import type { Struct } from "./struct";
import type {
  BoundFuncs,
  GenericFuncs,
  GenericMembers,
  MemberValues,
  PointerQualifier,
  TypeArg,
  TypeQualifier,
} from "./types";
import { createMemberValues } from "./utils";
import type { Val } from "./val";
import { Var } from "./variable";

/**
 * `tc` "class" api for c. Combines a struct with functions to create a class-like api.
 *
 * Accepts a struct and a dictionary of Func objects.
 *
 * Has helpers for creating variables and params that have a `_` field with struct field access Vals and "methods" ( bound functions ) on it.
 */
export class TcClass<
  Name extends string,
  Members extends GenericMembers,
  const Methods extends GenericFuncs
> {
  constructor(struct: Struct<Name, Members>, methods: Methods) {
    this.struct = struct;
    this.methods = methods;
  }
  struct;
  methods;

  var(name: string) {
    return VarClass.var(this.struct, name, this.methods);
  }

  pointer(name: string) {
    return VarClass.pointer(this.struct, name, this.methods);
  }

  static new<
    Name extends string,
    Members extends GenericMembers,
    const Methods extends GenericFuncs
  >(struct: Struct<Name, Members>, methods: Methods) {
    return new TcClass(struct, methods);
  }
}

/** tc equivalent of a class based api for c. */
export class VarClass<
  Name extends string,
  Members extends GenericMembers,
  const Methods extends GenericFuncs
> extends Var<Name> {
  constructor(
    type: TypeArg<Name>,
    name: string,
    struct: Struct<Name, Members>,
    methods: Methods
  ) {
    super(type, name);
    this.struct = struct;

    this._ = {
      ...createMemberValues(this, struct),
      ...createBoundFuncs(this, methods),
    } as MemberValues<Members> & BoundFuncs<Methods>;
  }
  struct;
  /** A typed dictionary of arrow/dot access ( arrow if pointer ) Val objects for each member and bound functions that serve as methods. */
  _;

  static var<
    Name extends string,
    Members extends GenericMembers,
    const Methods extends GenericFuncs
  >(
    struct: Struct<Name, Members>,
    name: string,
    methods: Methods,
    typeQualifiers?: TypeQualifier[]
  ) {
    return new VarClass(struct.type(typeQualifiers), name, struct, methods);
  }

  static pointer<
    Name extends string,
    Members extends GenericMembers,
    const Methods extends GenericFuncs
  >(
    struct: Struct<Name, Members>,
    name: string,
    methods: Methods,
    typeQualifiers?: TypeQualifier[],
    pointerQualifiers?: PointerQualifier[]
  ) {
    return new VarClass<`${Name}*`, Members, Methods>(
      struct.type(typeQualifiers).pointer(pointerQualifiers),
      name,
      struct as any,
      methods
    );
  }
}

const createBoundFuncs = (exp: Val, funcs: GenericFuncs) => {
  const bound: Record<string, any> = {};
  Object.entries(funcs).forEach(([key, fn]) => {
    bound[key] = (...args: any[]) => {
      return fn(exp, ...args);
    };
  });
  return bound;
};
