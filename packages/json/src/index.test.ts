import { describe, it, expect } from 'vitest';
import { safeParse, safeStringify } from './index';

describe('@typepurify/json', () => {
  describe('safeParse', () => {
    it('should parse valid JSON successfully', () => {
      const result = safeParse('{"test": 123}');
      expect(result).toEqual({ test: 123 });
    });

    it('should fallback if parsing fails', () => {
      const result = safeParse('invalid json', { fallback: true });
      expect(result).toEqual({ fallback: true });
    });

    it('should throw if parsing fails and no fallback is provided', () => {
      expect(() => safeParse('invalid json')).toThrow();
    });

    it('should use TypePurify CleanOptions correctly', () => {
      const result = safeParse<any>('{"test": ""}', undefined, { stripEmptyStrings: true });
      expect(result?.test).toBeUndefined();
    });
  });

  describe('safeStringify', () => {
    it('should stringify a valid object', () => {
      const result = safeStringify({ test: 123 });
      expect(result).toBe('{"test":123}');
    });

    it('should fallback to default {} when stringify fails (circular ref)', () => {
      const obj: any = {};
      obj.self = obj;

      const result = safeStringify(obj);
      expect(result).toBe('{}');
    });

    it('should fallback to custom string when stringify fails', () => {
      const obj: any = {};
      obj.self = obj;

      const result = safeStringify(obj, '{"error": true}');
      expect(result).toBe('{"error": true}');
    });
  });
});
