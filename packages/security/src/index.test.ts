import { describe, it, expect } from 'vitest';
import { escapeHtml, stripHtml, sanitizeUrl } from './index';

describe('@typepurify/security', () => {
  describe('escapeHtml', () => {
    it('should escape dangerous characters', () => {
      const input = '<script>alert("XSS & \'attack\'")</script>';
      const expected = '&lt;script&gt;alert(&quot;XSS &amp; &#39;attack&#39;&quot;)&lt;/script&gt;';
      expect(escapeHtml(input)).toBe(expected);
    });

    it('should return non-strings as is', () => {
      expect(escapeHtml(123 as any)).toBe(123);
    });
  });

  describe('stripHtml', () => {
    it('should remove HTML tags', () => {
      const input = '<p>Hello <b>World</b></p><script>alert(1)</script>';
      const expected = 'Hello Worldalert(1)';
      expect(stripHtml(input)).toBe(expected);
    });
  });

  describe('sanitizeUrl', () => {
    it('should allow safe URLs', () => {
      expect(sanitizeUrl('https://example.com')).toBe('https://example.com');
      expect(sanitizeUrl('http://example.com')).toBe('http://example.com');
      expect(sanitizeUrl('mailto:test@test.com')).toBe('mailto:test@test.com');
      expect(sanitizeUrl('/relative/path')).toBe('/relative/path');
    });

    it('should block dangerous URLs', () => {
      expect(sanitizeUrl('javascript:alert(1)')).toBe('#');
      expect(sanitizeUrl(' javascript:alert(1)')).toBe('#'); // with leading space
      expect(sanitizeUrl('vbscript:alert(1)')).toBe('#');
      expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe('#');
    });
  });
});
