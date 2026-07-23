import { describe, it, expect } from 'vitest';
import { prompt } from './index';

describe('@typepurify/llm', () => {
  it('should trim and strip common indentation', () => {
    const p = prompt`
      You are a helpful assistant.
      
      Please answer the following:
        - Question 1
        - Question 2
    `;

    const expected = `You are a helpful assistant.

Please answer the following:
  - Question 1
  - Question 2`;

    expect(p).toBe(expected);
  });

  it('should interpolate values correctly', () => {
    const name = 'Alice';
    const age = 30;

    const p = prompt`
      Name: ${name}
      Age: ${age}
    `;

    expect(p).toBe(`Name: Alice\nAge: 30`);
  });
});
