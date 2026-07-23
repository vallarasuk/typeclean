import { clean, CleanOptions, cleanParse } from 'typepurify';

export interface PurifyFetchOptions extends CleanOptions {
  /** Uses cleanParse for potentially higher performance on JSON payloads */
  useCleanParse?: boolean;
}

/**
 * A wrapper around the native `fetch` API that automatically parses
 * and purifies JSON responses using typepurify.
 */
export async function tFetch<T = any>(
  input: RequestInfo | URL,
  init?: RequestInit,
  purifyOptions?: PurifyFetchOptions,
): Promise<T> {
  const response = await fetch(input, init);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    if (purifyOptions?.useCleanParse) {
      const text = await response.text();
      return cleanParse<T>(text, purifyOptions) as any;
    } else {
      const data = await response.json();
      return clean<T>(data, purifyOptions) as any;
    }
  }

  // Fallback for non-JSON responses
  return (await response.text()) as any;
}
