# 🚀 TypePurify Ecosystem Roadmap (AI-Optimized)

> **Agent Instruction:** When instructed to "build the next feature", find the first package that is not `[x] Completed`. Then, find the first feature within that package that is `[ ] Pending` and implement it. Update the checkbox to `[x]` upon completion.

---

## 1. API & Backend Utilities

### `@typepurify/core` (Formerly `typepurify`)

**Status:** 🟢 Completed (Active Maintenance)
**Description:** The core engine. Removes null, undefined, empty arrays/objects.

- `[x]` feat: `clean()`, `cleanAsync()`, `cleanParse()` APIs.
- `[x]` feat: Deep recursive zero-schema type inference.

### `@typepurify/fetch`

**Status:** 🟢 Completed (Active Maintenance)
**Description:** Safe fetch wrapper with auto-purification, retries, timeouts, and JSON parsing.

- `[x]` feat: Initial wrapper around native `fetch`.
- `[x]` feat: Auto-parse and purify JSON responses.
- `[x]` feat: Automatic retry strategies (exponential backoff).
- `[x]` feat: Timeout configuration with AbortController.
- `[x]` feat: Request/Response interceptors.

### `@typepurify/retry`

**Status:** ⚪ Pending
**Description:** Standalone retry utility for async functions.

- `[ ]` feat: Implement `retry(asyncFn, options)`.
- `[ ]` feat: Support exponential backoff and jitter algorithms.
- `[ ]` feat: Implement retry limits and timeout bounds.

### `@typepurify/dedupe`

**Status:** ⚪ Pending
**Description:** Request deduplicator to prevent duplicate API calls.

- `[ ]` feat: In-memory hash-based request caching.
- `[ ]` feat: Automatic request debouncing.

### `@typepurify/paginate`

**Status:** ⚪ Pending
**Description:** Smart pagination utilities.

- `[ ]` feat: Cursor-based pagination parser.
- `[ ]` feat: Offset-based pagination parser.
- `[ ]` feat: Infinite scroll state machine.

### `@typepurify/cache`

**Status:** ⚪ Pending
**Description:** Simple in-memory REST API cache.

- `[ ]` feat: TTL-based in-memory caching.
- `[ ]` feat: LRU (Least Recently Used) eviction policy.

---

## 2. TypeScript Utilities

### `@typepurify/types`

**Status:** ⚪ Pending
**Description:** Advanced TypeScript utility types and helpers.

- `[ ]` feat: Deep Type Merge utility type.
- `[ ]` feat: JSON to TS Type Generator logic.
- `[ ]` feat: Deep Immutable Helper (`DeepReadonly`).
- `[ ]` feat: Safe Object Path extractor (`get(obj, "path")`).

---

## 3. React Ecosystem

### `@typepurify/react-table`

**Status:** ⚪ Pending
**Description:** Universal, zero-dependency Data Table.

- `[ ]` feat: Sorting and Filtering engines.
- `[ ]` feat: Pagination state management.
- `[ ]` feat: Search and Export to CSV.

### `@typepurify/react-state`

**Status:** ⚪ Pending
**Description:** Tiny alternatives for form, loading, and query state.

- `[ ]` feat: `useLoading()` - Universal loading state manager.
- `[ ]` feat: `useSmartForm()` - Tiny alternative to React Hook Form.
- `[ ]` feat: `useApiQuery()` - Tiny alternative to TanStack Query.

---

## 4. AI & LLMs

### `@typepurify/llm`

**Status:** ⚪ Pending
**Description:** AI response utilities.

- `[ ]` feat: LLM Response Cleaner (Fixes malformed JSON).
- `[ ]` feat: Prompt Template Manager.
- `[ ]` feat: Token Counter (OpenAI, Gemini, Claude).
- `[ ]` feat: AI Streaming Parser wrapper.

---

## 5. Security & Logging

### `@typepurify/logger`

**Status:** ⚪ Pending
**Description:** Enterprise logging suite.

- `[ ]` feat: Enterprise Logger (JSON, Colors, File).
- `[ ]` feat: Request Logger middleware (Express, Fastify, NestJS).
- `[ ]` feat: Error Reporter with beautiful stack traces.

### `@typepurify/security`

**Status:** ⚪ Pending
**Description:** Security inspection tools.

- `[ ]` feat: Secret Detector (Find API keys in objects).
- `[ ]` feat: JWT Inspector and Validator.
- `[ ]` feat: Input/URL Sanitizers.

---

## 6. CLI & Dev Productivity

### `@typepurify/cli`

**Status:** ⚪ Pending
**Description:** Scaffolding and analysis CLI.

- `[ ]` feat: Project Bootstrap CLI (`create-my-stack`).
- `[ ]` feat: Duplicate File / Dependency Analyzer.
- `[ ]` feat: `.env` Validator and Doc Generator.

---

## 7. JSON Utilities

### `@typepurify/json`

**Status:** ⚪ Pending
**Description:** Advanced JSON manipulation.

- `[ ]` feat: Deep JSON Diff engine.
- `[ ]` feat: JSON Repair (Fixes invalid strings).
- `[ ]` feat: Circular Object Cleaner.
- `[ ]` feat: Object Comparison Engine (Ignore specific keys/types).
