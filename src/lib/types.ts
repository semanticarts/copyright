/**
 * @copyright Copyright © 2018 - 2022 by Semantic Arts LLC
 * @license Semantic Arts' Limited Access Open Source Full License https://semanticarts.com/license
 */

/**
 * General types there ought to be a library for.
 */

export type Shallow<X> = {
  [x in keyof X]: unknown;
};

export function getMissingKeys(object: object, requiredKeys: string[]) {
  const missingKeys = requiredKeys.reduce(
    (missing: string[], key) => (key in object ? missing : [key, ...missing]),
    []
  );

  return missingKeys;
}

export function getExtraneousKeys(object: object, validKeys: string[]) {
  const extraneousKeys = Object.keys(object).reduce(
    (extraneous: string[], key) =>
      validKeys.includes(key) ? extraneous : [key, ...extraneous],
    []
  );

  return extraneousKeys;
}

/**
 * Ensure that @param x is an object with the keys of @param keys
 * Note: does not do any type checking on the value of x[key]
 *
 * This would be possible to do using only X using a transformer, but I can't figure it out
 * Unfortunately this means you have to duplicate writing the keys in places.
 *
 * I looked at the ts-transformers-keys library, but it doesn't work here
 *
 * @param x The object to have the keys on it
 * @param keys The list of keys that the object need have
 * @returns whether or not @param x is correct, to a shallow depth.
 */
export function isShallow<X extends object>(
  x: unknown,
  keys: string[]
): x is Shallow<X> {
  return x !== null && typeof x === "object" && keys.every((key) => key in x);
}
