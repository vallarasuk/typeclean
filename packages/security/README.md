# @typepurify/security

Lightweight utility functions for basic web security tasks (XSS prevention, HTML escaping, URL sanitization). Part of the TypePurify ecosystem.

## Installation

```bash
npm install @typepurify/security
```

## Usage

### `escapeHtml`

Converts characters like `<`, `>`, `&`, `"`, and `'` to their HTML entities to safely embed user input in HTML.

```typescript
import { escapeHtml } from '@typepurify/security';

const userInput = '<script>alert("XSS")</script>';
const safeString = escapeHtml(userInput);
// &lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;
```

### `stripHtml`

Removes all HTML tags from a string, leaving only the text content.

```typescript
import { stripHtml } from '@typepurify/security';

const input = 'Hello <b>World</b>!';
const textOnly = stripHtml(input);
// Hello World!
```

### `sanitizeUrl`

Ensures a URL is safe for `href` attributes, blocking dangerous protocols like `javascript:`, `vbscript:`, and `data:`.

```typescript
import { sanitizeUrl } from '@typepurify/security';

const safeLink = sanitizeUrl('https://example.com'); // 'https://example.com'
const maliciousLink = sanitizeUrl('javascript:alert("XSS")'); // '#'
```
