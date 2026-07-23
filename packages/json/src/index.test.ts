import { describe, it, expect } from 'vitest';
import { init } from './index';

describe('@typepurify/json', () => {
  it('should initialize successfully', () => {
    expect(init()).toBe('json initialized');
  });
});
