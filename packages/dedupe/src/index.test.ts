import { describe, it, expect } from 'vitest';
import { init } from './index';

describe('@typepurify/dedupe', () => {
  it('should initialize successfully', () => {
    expect(init()).toBe('dedupe initialized');
  });
});
