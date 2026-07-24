export interface RetryOptions {
  /** Number of maximum retries (default: 3) */
  retries?: number;
  /** Initial delay between retries in milliseconds (default: 1000) */
  delay?: number;
  /** Backoff algorithm (default: 'fixed') */
  backoff?: 'fixed' | 'exponential';
  /** Whether to add jitter to the delay (default: false) */
  jitter?: boolean;
  /** Maximum time in milliseconds allowed for the entire execution including retries */
  timeout?: number;
  /** Optional callback when a retry happens */
  onRetry?: (error: Error, attempt: number) => void;
  /** Custom logic to determine if we should retry (default: always true) */
  shouldRetry?: (error: Error) => boolean;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
  }
}

/**
 * Wraps an asynchronous function with robust retry logic.
 *
 * @param fn The async function to execute.
 * @param options Configuration for retries.
 * @returns The resolved value of the async function.
 */
export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const retries = options.retries ?? 3;
  const initialDelay = options.delay ?? 1000;
  const backoff = options.backoff ?? 'fixed';
  const jitter = options.jitter ?? false;

  let attempt = 0;
  const startTime = Date.now();

  const executeWithTimeout = async () => {
    if (options.timeout !== undefined) {
      const timeRemaining = options.timeout - (Date.now() - startTime);
      if (timeRemaining <= 0) {
        throw new TimeoutError('Operation timed out');
      }

      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      let timeoutId: any;
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => {
          controller?.abort();
          reject(new TimeoutError('Operation timed out'));
        }, timeRemaining);
      });

      try {
        // We pass the abort signal to the function if it supports it.
        // Assuming the user's function can take an AbortSignal, we would pass it.
        // For backwards compatibility without breaking types, we just use Promise.race,
        // but if they passed a custom fetch inside, they should hook up to the signal.
        // In the future, we could augment `fn` to accept a signal.
        const result = await Promise.race([fn(), timeoutPromise]);
        clearTimeout(timeoutId);
        return result;
      } catch (err) {
        clearTimeout(timeoutId);
        throw err;
      }
    }
    return fn();
  };

  while (attempt <= retries) {
    try {
      return await executeWithTimeout();
    } catch (error: any) {
      attempt++;

      if (error.name === 'TimeoutError' || attempt > retries) {
        throw error;
      }

      if (options.shouldRetry && !options.shouldRetry(error)) {
        throw error;
      }

      if (options.onRetry) {
        options.onRetry(error, attempt);
      }

      let currentDelay =
        backoff === 'exponential' ? initialDelay * Math.pow(2, attempt - 1) : initialDelay;

      if (jitter) {
        // Add random jitter between 0 and currentDelay
        currentDelay = Math.random() * currentDelay;
      }

      // Ensure sleep honors the overall timeout if defined
      if (options.timeout !== undefined) {
        const timeRemaining = options.timeout - (Date.now() - startTime);
        if (timeRemaining <= 0) {
          throw new TimeoutError('Operation timed out');
        }
        currentDelay = Math.min(currentDelay, timeRemaining);
      }

      await sleep(currentDelay);
    }
  }
  throw new Error('Unreachable');
}

/**
 * Alias for withRetry
 */
export const retry = withRetry;
