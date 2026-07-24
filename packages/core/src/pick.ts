export type DeepPick<T, K extends string | number | symbol> = T extends object
  ? T extends Array<infer U>
    ? Array<DeepPick<U, K>>
    : {
        [P in keyof T as P extends K ? P : never]: DeepPick<T[P], K>;
      }
  : T;

/**
 * Deeply picks specified keys from an object or array of objects.
 *
 * @param obj The payload to process.
 * @param keys The keys to pick recursively.
 * @returns A brand new object with only the specified keys.
 */
export function deepPick<T, K extends string | number | symbol>(
  obj: T,
  keys: K[] | Set<K>,
): DeepPick<T, K> {
  if (obj === null || obj === undefined) return obj as any;

  const keysSet = keys instanceof Set ? keys : new Set(keys);

  if (Array.isArray(obj)) {
    return obj.map((item) => deepPick(item, keysSet)) as any;
  }

  if (typeof obj === 'object') {
    if (obj instanceof Date || obj instanceof RegExp || obj instanceof Error) {
      return obj as any;
    }

    const result: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (keysSet.has(key as any)) {
          result[key] = obj[key];
        } else {
          const pickedNested = deepPick(obj[key], keysSet);
          if (
            typeof pickedNested === 'object' &&
            pickedNested !== null &&
            Object.keys(pickedNested).length > 0
          ) {
            result[key] = pickedNested;
          }
        }
      }
    }
    return result;
  }

  return obj as any;
}
