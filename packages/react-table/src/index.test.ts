import { describe, it, expect } from 'vitest';
import { init } from './index';

describe('@typepurify/react-table', () => {
  it('should initialize successfully', () => {
    expect(init()).toBe('react-table initialized');
  });
});
