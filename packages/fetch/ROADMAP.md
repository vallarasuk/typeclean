# @typepurify/fetch Roadmap

## Phase 1: Core Implementation (v0.1.x)

- [x] Initial wrapper around native `fetch`.
- [x] Auto-parse and purify JSON responses.
- [ ] Add support for custom error handling.
- [ ] Expose global configuration for `PurifyFetchOptions`.

## Phase 2: React & SSR Integrations (v0.2.x)

- [ ] Next.js App Router (Server Components) compatibility.
- [ ] Provide seamless typings for standard SWR and React Query integrations.

## Phase 3: Advanced Features (v1.0.x)

- [ ] Request/Response Interceptors.
- [ ] Automatic retry strategies on 5xx errors.
