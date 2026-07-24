export type DeepOmit<T, K extends string | number | symbol> = T extends object
  ? T extends Array<infer U>
    ? Array<DeepOmit<U, K>>
    : {
        [P in keyof T as P extends K ? never : P]: DeepOmit<T[P], K>;
      }
  : T;

/**
 * Deeply omits specified keys from an object or array of objects.
 *
 * @param obj The payload to process.
 * @param keys The keys to omit recursively.
 * @returns A brand new object with the specified keys removed.
 */
export function deepOmit<T, K extends string | number | symbol>(
  obj: T,
  keys: K[] | Set<K>,
): DeepOmit<T, K> {
  if (obj === null || obj === undefined) return obj as any;

  const keysSet = keys instanceof Set ? keys : new Set(keys);

  if (Array.isArray(obj)) {
    return obj.map((item) => deepOmit(item, keysSet)) as any;
  }

  if (typeof obj === 'object') {
    if (obj instanceof Date || obj instanceof RegExp || obj instanceof Error) {
      return obj as any;
    }

    const result: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (!keysSet.has(key as any)) {
          result[key] = deepOmit(obj[key], keysSet);
        }
      }
    }
    return result;
  }

  return obj as any;
}
