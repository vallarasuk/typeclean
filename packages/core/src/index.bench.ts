import { bench, describe } from 'vitest';
import { clean, cleanInPlace } from './index';

describe('typepurify performance', () => {
  const getLargePayload = () => ({
    user: {
      id: 1,
      name: 'John',
      email: null,
      metadata: {
        lastLogin: new Date(),
        preferences: null,
        roles: ['admin', null, 'user'],
      },
    },
    posts: Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      title: `Post ${i}`,
      body: i % 2 === 0 ? null : 'Hello',
      comments: [null, undefined, { text: 'Great!' }],
    })),
    deletedAt: null,
  });

  bench('clean (immutable)', () => {
    clean(getLargePayload());
  });

  bench('cleanInPlace (mutable)', () => {
    cleanInPlace(getLargePayload());
  });
});
