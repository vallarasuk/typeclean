import { describe, it, expect } from 'vitest';
import { init } from './index';

describe('@typepurify/logger', () => {
  it('should initialize successfully', () => {
    expect(init()).toBe('logger initialized');
  });
});
