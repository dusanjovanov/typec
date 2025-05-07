/** Alias for the Javascript Array because typec has an Array class. */
export const JsArray = globalThis.Array;

export interface JsArray<T> extends Array<T> {}

/** Alias for the Javascript String because typec has a String class. */
export const JsString = globalThis.String;

export interface JsString extends String {}
