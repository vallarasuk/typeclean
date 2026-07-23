<div align="center">
  <h1>✨ @typepurify/fetch</h1>
  <p>A powerful, type-safe wrapper around native fetch that automatically parses and deeply cleans JSON API responses.</p>
</div>

---

[![npm version](https://img.shields.io/npm/v/@typepurify/fetch.svg?style=flat-square)](https://www.npmjs.com/package/@typepurify/fetch)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)

## 🚀 Overview

`@typepurify/fetch` is part of the **TypePurify Ecosystem**. It provides a drop-in replacement for the native `fetch` API that automatically strips out `null` and `undefined` properties from JSON responses, ensuring that your frontend state stays clean and perfectly typed.

---

## 📦 Installation

```bash
npm install @typepurify/fetch typepurify
```

## 💻 Usage & Visual Examples

### Standard Fetch vs `tFetch`

Instead of manually parsing JSON and manually cleaning it, `tFetch` handles it all under the hood.

```typescript
import { tFetch } from '@typepurify/fetch';

// ✨ Calling the API
const pristineData = await tFetch('https://api.example.com/users/1');

/*
If the API returns:
{ "id": 1, "name": "Jane", "bio": null, "address": null }

tFetch automatically returns:
{ "id": 1, "name": "Jane" }
*/
```

### High-Performance Parsing Mode

If you have massive JSON payloads (megabytes in size), you can enable `useCleanParse` to bypass the native `JSON.parse` entirely. This parses and cleans the JSON string in a single memory-efficient pass!

```typescript
const pristineData = await tFetch('https://api.example.com/massive-data', undefined, {
  useCleanParse: true,
  stripEmptyArrays: true,
});
```

### Fallbacks and Errors

- Automatically throws an Error on non-ok HTTP responses (e.g., `404`).
- If the response is not `application/json`, it elegantly falls back to returning plain text.

---

## 🛡️ License

MIT © [Vallarasu Kanthasamy](https://github.com/vallarasuk)
