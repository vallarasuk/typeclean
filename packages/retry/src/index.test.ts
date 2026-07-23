import { describe, it, expect } from 'vitest';
import { init } from './index';

describe('@typepurify/retry', () => {
  it('should initialize successfully', () => {
    expect(init()).toBe('retry initialized');
  });
});
