import { describe, it, expect } from 'vitest';
import { deepPick } from './pick';

describe('deepPick', () => {
  it('should pick top-level keys', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = deepPick(obj, ['b', 'c']);
    expect(result).toEqual({ b: 2, c: 3 });
  });

  it('should pick nested keys if they exist at any level', () => {
    // Note: The current implementation picks the key and includes its entire value.
    const obj = { a: 1, nested: { b: 2, c: 3, deep: { b: 4 } } };
    const result = deepPick(obj, ['b', 'nested']);
    // Since 'nested' is picked, the whole object is preserved
    expect(result).toEqual({ nested: { b: 2, c: 3, deep: { b: 4 } } });
  });

  it('should recursively pick keys', () => {
    const obj = { a: 1, nested: { b: 2, c: 3, deep: { b: 4 } } };
    // If we only pick 'b', 'nested' and 'deep' aren't picked, but we traverse to find 'b'
    const result = deepPick(obj, ['b']);
    expect(result).toEqual({ nested: { b: 2, deep: { b: 4 } } });
  });

  it('should pick keys from objects inside arrays', () => {
    const obj = {
      list: [
        { a: 1, b: 2 },
        { a: 3, b: 4 },
      ],
    };
    // 'list' is not picked, but we traverse it
    const result = deepPick(obj, ['a']);
    expect(result).toEqual({ list: [{ a: 1 }, { a: 3 }] });
  });

  it('should handle null and undefined safely', () => {
    expect(deepPick(null, ['a'])).toBeNull();
    expect(deepPick(undefined, ['a'])).toBeUndefined();
  });
});
