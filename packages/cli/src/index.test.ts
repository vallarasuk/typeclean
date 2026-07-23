import { describe, it, expect } from 'vitest';
import { init } from './index';

describe('@typepurify/cli', () => {
  it('should initialize successfully', () => {
    expect(init()).toBe('cli initialized');
  });
});
