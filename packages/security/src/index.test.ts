import { describe, it, expect } from 'vitest';
import { init } from './index';

describe('@typepurify/security', () => {
  it('should initialize successfully', () => {
    expect(init()).toBe('security initialized');
  });
});
