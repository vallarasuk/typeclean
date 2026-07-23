import { describe, it, expect } from 'vitest';
import { init } from './index';

describe('@typepurify/paginate', () => {
  it('should initialize successfully', () => {
    expect(init()).toBe('paginate initialized');
  });
});
