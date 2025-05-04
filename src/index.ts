export * from "./app";
export * from "./array";
export * from "./chunk";
export * from "./condition";
export * from "./constants";
export * from "./enum";
export * from "./func";
export * from "./gcc";
export * from "./include";
export * from "./lib";
export * from "./literal";
export * from "./loops";
export * from "./operators";
export * from "./param";
export * from "./std";
export * from "./string";
export * from "./struct";
export * from "./structVar";
export * from "./type";
export * from "./types";
export * from "./utils";
export * from "./value";
export * from "./variable";

/** Alias for the Javascript Array because typec has an Array class. */
export const JsArray = globalThis.Array;

export interface JsArray<T> extends Array<T> {}

/** Alias for the Javascript String because typec has a String class. */
export const JsString = globalThis.String;

export interface JsString extends String {}
