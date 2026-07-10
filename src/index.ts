export type DeepRequired<T> = T extends Builtin
  ? T
  : T extends Map<infer K, infer V>
    ? Map<DeepRequired<K>, DeepRequired<V>>
    : T extends ReadonlyMap<infer K, infer V>
      ? ReadonlyMap<DeepRequired<K>, DeepRequired<V>>
      : T extends WeakMap<infer K, infer V>
        ? WeakMap<DeepRequired<K>, DeepRequired<V>>
        : T extends Set<infer U>
          ? Set<DeepRequired<U>>
          : T extends ReadonlySet<infer U>
            ? ReadonlySet<DeepRequired<U>>
            : T extends WeakSet<infer U>
              ? WeakSet<DeepRequired<U>>
              : T extends Array<infer U>
                ? Array<DeepRequired<U>>
                : T extends Promise<infer U>
                  ? Promise<DeepRequired<U>>
                  : T extends {}
                    ? { [K in keyof T]-?: DeepRequired<NonNullable<T[K]>> }
                    : NonNullable<T>;

type Builtin = Function | Date | Error | RegExp;

/**
 * Configuration options for the typepurify cleaning engine.
 */
export interface CleanOptions {
  /** Removes all empty strings `""` from the payload. */
  stripEmptyStrings?: boolean;
  /** Removes all empty arrays `[]` from the payload. */
  stripEmptyArrays?: boolean;
  /** Removes all empty objects `{}` from the payload. */
  stripEmptyObjects?: boolean;
  /** Trims whitespace from strings before processing them. */
  trimStrings?: boolean;
  /** Custom predicate function. If it returns true, the value is stripped. */
  stripWhen?: (value: any) => boolean;
  /** Custom transform callback function to mutate or format values before cleaning. */
  transform?: (value: any, key?: any) => any;
}

/**
 * Recursively deep-cleans null and undefined values from objects and arrays.
 * Dynamically re-infers compile-time types without requiring manual schemas.
 *
 * @param obj The payload to clean.
 * @param options Configuration for stripping empty values.
 * @param seen (Internal) WeakSet to track circular references.
 * @returns A brand new object with null/undefined values removed, heavily typed via `DeepRequired`.
 *
 * @example
 * const payload = { id: 1, name: null };
 * const safe = clean(payload); // { id: 1 }
 */
export function clean<T>(
  obj: T,
  options: CleanOptions = {},
  seen = new WeakSet(),
  key?: any,
): DeepRequired<T> {
  if (options.transform) {
    obj = options.transform(obj, key);
  }

  if (obj === null || obj === undefined) {
    return undefined as any;
  }

  if (options.stripWhen && options.stripWhen(obj)) {
    return undefined as any;
  }

  if (typeof obj !== 'object') {
    if (typeof obj === 'string') {
      const val = options.trimStrings ? obj.trim() : obj;
      if (val === '' && options.stripEmptyStrings) return undefined as any;
      return val as any;
    }
    return obj as any;
  }

  if (seen.has(obj as any)) return obj as any;
  seen.add(obj as any);

  if (Array.isArray(obj)) {
    const cleanedArray = [];
    for (let i = 0; i < obj.length; i++) {
      const cleanedItem = clean(obj[i], options, seen, i);
      if (cleanedItem !== undefined) {
        cleanedArray.push(cleanedItem);
      }
    }

    if (cleanedArray.length === 0 && options.stripEmptyArrays) {
      return undefined as any;
    }
    return cleanedArray as any;
  }

  if (obj instanceof Map) {
    const cleanedMap = new Map();
    for (const [k, v] of obj.entries()) {
      const cleanedKey = clean(k, options, seen);
      const cleanedValue = clean(v, options, seen, k);
      if (cleanedKey !== undefined && cleanedValue !== undefined) {
        cleanedMap.set(cleanedKey, cleanedValue);
      }
    }
    if (cleanedMap.size === 0 && options.stripEmptyObjects) {
      return undefined as any;
    }
    return cleanedMap as any;
  }

  if (obj instanceof Set) {
    const cleanedSet = new Set();
    for (const v of obj.values()) {
      const cleanedValue = clean(v, options, seen);
      if (cleanedValue !== undefined) {
        cleanedSet.add(cleanedValue);
      }
    }
    if (cleanedSet.size === 0 && options.stripEmptyArrays) {
      return undefined as any;
    }
    return cleanedSet as any;
  }

  if (
    obj instanceof Date ||
    obj instanceof RegExp ||
    obj instanceof Error ||
    typeof obj === 'function'
  ) {
    return obj as any;
  }

  const proto = Object.getPrototypeOf(obj);
  const cleanedObj: Record<string, any> =
    proto === null ? Object.create(null) : Object.create(proto);
  let hasKeys = false;

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const val = obj[key];
      const cleanedVal = clean(val, options, seen, key);

      if (cleanedVal !== undefined) {
        cleanedObj[key] = cleanedVal;
        hasKeys = true;
      }
    }
  }

  if (!hasKeys && options.stripEmptyObjects) {
    return undefined as any;
  }

  return cleanedObj as any;
}

/**
 * Recursively deep-cleans null and undefined values by mutating the original object directly.
 * Offers extreme performance and zero memory overhead for massive payloads.
 *
 * WARNING: Mutates the provided object. Use `clean()` if you need an immutable operation.
 *
 * @param obj The payload to mutate and clean.
 * @param options Configuration for stripping empty values.
 * @param seen (Internal) WeakSet to track circular references.
 * @returns The exact same object reference passed in, but cleaned.
 */
export function cleanInPlace<T>(
  obj: T,
  options: CleanOptions = {},
  seen = new WeakSet(),
  key?: any,
): DeepRequired<T> {
  if (options.transform) {
    const transformed = options.transform(obj, key);
    // If the transform changed the reference, we use the new reference.
    // Mutability can't apply strictly to primitives, but we update the local reference.
    obj = transformed;
  }

  if (obj === null || obj === undefined) {
    return undefined as any;
  }

  if (options.stripWhen && options.stripWhen(obj)) {
    return undefined as any;
  }

  if (typeof obj !== 'object') {
    if (typeof obj === 'string') {
      const val = options.trimStrings ? obj.trim() : obj;
      if (val === '' && options.stripEmptyStrings) return undefined as any;
      return val as any;
    }
    return obj as any;
  }

  if (seen.has(obj as any)) return obj as any;
  seen.add(obj as any);

  if (Array.isArray(obj)) {
    let writeIndex = 0;
    for (let i = 0; i < obj.length; i++) {
      const cleanedItem = cleanInPlace(obj[i], options, seen, i);
      if (cleanedItem !== undefined) {
        obj[writeIndex++] = cleanedItem;
      }
    }
    obj.length = writeIndex;

    if (obj.length === 0 && options.stripEmptyArrays) {
      return undefined as any;
    }
    return obj as any;
  }

  if (obj instanceof Map) {
    for (const [k, v] of Array.from(obj.entries())) {
      const cleanedKey = cleanInPlace(k, options, seen);
      const cleanedValue = cleanInPlace(v, options, seen, k);

      // If the key or value was removed, or if the key was transformed to a new key
      if (cleanedKey === undefined || cleanedValue === undefined) {
        obj.delete(k);
      } else {
        if (cleanedKey !== k) {
          obj.delete(k);
          obj.set(cleanedKey, cleanedValue);
        } else {
          obj.set(k, cleanedValue);
        }
      }
    }
    if (obj.size === 0 && options.stripEmptyObjects) {
      return undefined as any;
    }
    return obj as any;
  }

  if (obj instanceof Set) {
    for (const v of Array.from(obj.values())) {
      const cleanedValue = cleanInPlace(v, options, seen);

      if (cleanedValue === undefined) {
        obj.delete(v);
      } else if (cleanedValue !== v) {
        obj.delete(v);
        obj.add(cleanedValue);
      }
    }
    if (obj.size === 0 && options.stripEmptyArrays) {
      return undefined as any;
    }
    return obj as any;
  }

  if (
    obj instanceof Date ||
    obj instanceof RegExp ||
    obj instanceof Error ||
    typeof obj === 'function'
  ) {
    return obj as any;
  }

  let hasKeys = false;

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const val = obj[key];
      const cleanedVal = cleanInPlace(val, options, seen, key);

      if (cleanedVal === undefined) {
        delete (obj as any)[key];
      } else {
        (obj as any)[key] = cleanedVal;
        hasKeys = true;
      }
    }
  }

  if (!hasKeys && options.stripEmptyObjects) {
    return undefined as any;
  }

  return obj as any;
}
