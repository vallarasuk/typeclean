import { describe, it, expect } from 'vitest';
import { init } from './index';

describe('@typepurify/types', () => {
  it('should initialize successfully', () => {
    expect(init()).toBe('types initialized');
  });
});
