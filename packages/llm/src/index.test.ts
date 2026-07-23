import { describe, it, expect } from 'vitest';
import { init } from './index';

describe('@typepurify/llm', () => {
  it('should initialize successfully', () => {
    expect(init()).toBe('llm initialized');
  });
});
