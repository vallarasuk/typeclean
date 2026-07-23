import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { tFetch } from './index';

describe('tFetch wrapper', () => {
  let fetchMock: any;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should automatically parse and clean JSON responses', async () => {
    const rawData = { data: 'hello', emptyObj: {}, nullVal: null };

    fetchMock.mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => rawData,
    });

    const result = await tFetch('https://api.example.com/data');

    // By default, typepurify removes nulls and undefined
    expect(result).toEqual({ data: 'hello', emptyObj: {} });
    expect(fetchMock).toHaveBeenCalledWith('https://api.example.com/data', undefined);
  });

  it('should use cleanParse when useCleanParse is true', async () => {
    const rawDataString = '{"data":"hello","emptyObj":{},"nullVal":null}';

    fetchMock.mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      text: async () => rawDataString,
    });

    const result = await tFetch('https://api.example.com/data', undefined, {
      useCleanParse: true,
      stripEmptyObjects: true,
    });

    expect(result).toEqual({ data: 'hello' });
  });

  it('should return plain text for non-JSON responses', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ 'content-type': 'text/html' }),
      text: async () => '<html><body>Hello</body></html>',
    });

    const result = await tFetch('https://api.example.com/html');

    expect(result).toBe('<html><body>Hello</body></html>');
  });

  it('should throw an error on non-ok HTTP responses', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(tFetch('https://api.example.com/not-found')).rejects.toThrow(
      'HTTP error! status: 404',
    );
  });

  it('should pass purifyOptions correctly to the cleaner', async () => {
    const rawData = { name: 'Alice', emptyString: '' };

    fetchMock.mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => rawData,
    });

    // We can disable stripEmptyStrings for this specific fetch
    const result = await tFetch('https://api.example.com/data', undefined, {
      stripEmptyStrings: false,
    });

    expect(result).toEqual({ name: 'Alice', emptyString: '' });
  });
});
