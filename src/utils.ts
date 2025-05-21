import { isTcObject } from "./branding";
import type { Struct } from "./struct";
import { Type } from "./type";
import type {
  CodeLike,
  ExtractTypeStr,
  GenericMembers,
  MemberTypeArg,
  StructPointer,
} from "./types";
import type { Union } from "./union";
import { ValStruct, ValUnion, type Val } from "./val";

/**
 * Returns an empty string when the value is falsy or an empty array.
 * You can pass a format function to transform the truthy value.
 * If the format function is not passed the truthy value itself is returned.
 */
export const emptyFalsy = <T>(
  value: T | null | undefined | boolean,
  format?: (str: T) => string
) => {
  const isEmpty =
    value == null ||
    value === false ||
    (Array.isArray(value) && value.length === 0) ||
    value === "";

  if (isEmpty) return "";

  return format ? format(value as T) : String(value);
};

export const emptyNotFalse = <T>(
  value: T | null | undefined | boolean,
  format?: (str: T) => string
) => {
  const isEmpty =
    value == null ||
    (Array.isArray(value) && value.length === 0) ||
    value === "";

  if (isEmpty) return "";

  return format ? format(value as T) : String(value);
};

export const join = (arr: CodeLike[], sep = " ") => {
  return arr.filter((v) => v != null).join(sep);
};

export const joinWithPrefix = (arr: CodeLike[], prefix: string, sep = " ") => {
  return join(
    arr.map((e) => `${prefix}${e}`),
    sep
  );
};

export const joinArgs = (args: CodeLike[]) => {
  return join(args, ",");
};

export const stringSplice = (
  str: string,
  offset: number,
  strToInsert: string,
  removeCount = 0
) => {
  let calculatedOffset = offset < 0 ? str.length + offset : offset;
  return (
    str.substring(0, calculatedOffset) +
    strToInsert +
    str.substring(calculatedOffset + removeCount)
  );
};

export const unique = <T>(arr: T[]) => {
  return Array.from(new Set(arr));
};

export const createMemberValues = <Members extends GenericMembers>(
  val: Val,
  struct:
    | Struct<any, Members>
    | Union<any, Members>
    | StructPointer<any, Members>
) => {
  const vals: Record<any, any> = {};
  Object.keys(struct.members).forEach((key) => {
    const memberVal =
      val.type.typeKind === "pointer" ? val.arrow(key) : val.dot(key);

    if (isTcObject("struct", struct.members[key])) {
      vals[key] = new ValStruct(struct.members[key], memberVal.exp);
    }
    //
    else if (isTcObject("structPointer", struct.members[key])) {
      vals[key] = new ValStruct(
        struct.members[key],
        (val.type.typeKind === "pointer"
          ? val.arrow(key, Type.pointer(Type.any()))
          : val.dot(key, Type.pointer(Type.any()))
        ).exp
      );
    }
    //
    else if (isTcObject("union", struct.members[key])) {
      vals[key] = new ValUnion(struct.members[key], memberVal.exp);
    }
    //
    else {
      vals[key] = memberVal;
    }
  });
  return vals as {
    [Key in keyof Members]: Members[Key] extends Struct<infer N, infer M>
      ? ValStruct<N, M>
      : Members[Key] extends Union<infer N, infer M>
      ? ValUnion<N, M>
      : Members[Key] extends StructPointer<infer N, infer M>
      ? ValStruct<`${N}*`, M>
      : Val<ExtractTypeStr<Members[Key]>>;
  };
};

export const memberTypeArgToType = (type: MemberTypeArg) => {
  return isTcObject("type", type)
    ? type
    : isTcObject("structPointer", type)
    ? type.struct.pointer()
    : type.type();
};
