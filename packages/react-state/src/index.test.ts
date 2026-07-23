import { describe, it, expect } from 'vitest';
import { init } from './index';

describe('@typepurify/react-state', () => {
  it('should initialize successfully', () => {
    expect(init()).toBe('react-state initialized');
  });
});
