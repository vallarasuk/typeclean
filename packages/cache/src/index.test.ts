import { describe, it, expect } from 'vitest';
import { init } from './index';

describe('@typepurify/cache', () => {
  it('should initialize successfully', () => {
    expect(init()).toBe('cache initialized');
  });
});
