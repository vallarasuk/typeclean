import { useState, useCallback } from 'react';
import { clean, type DeepRequired, type CleanOptions } from 'typepurify';

/**
 * A useState alternative that automatically deep-cleans the initial state and any subsequent updates.
 */
export function usePurifiedState<T, const O extends CleanOptions = {}>(
  initialState: T | (() => T),
  options?: O,
): [DeepRequired<T, O>, (newState: T | ((prevState: DeepRequired<T, O>) => T)) => void] {
  const [state, setState] = useState<DeepRequired<T, O>>(() => {
    const value = typeof initialState === 'function' ? (initialState as Function)() : initialState;
    return clean(value, options);
  });

  const setPurifiedState = useCallback(
    (newState: T | ((prevState: DeepRequired<T, O>) => T)) => {
      setState((prevState) => {
        const valueToClean =
          typeof newState === 'function' ? (newState as Function)(prevState) : newState;
        return clean(valueToClean, options);
      });
    },
    [options],
  );

  return [state, setPurifiedState];
}

/**
 * Universal loading state manager.
 * Returns a boolean and a wrapper function that automatically handles loading state for async functions.
 */
export function useLoading(): [boolean, <T>(promise: Promise<T>) => Promise<T>] {
  const [isLoading, setIsLoading] = useState(false);

  const withLoading = useCallback(async <T>(promise: Promise<T>): Promise<T> => {
    setIsLoading(true);
    try {
      return await promise;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return [isLoading, withLoading];
}

/**
 * Tiny alternative to React Hook Form.
 */
export function useSmartForm<T extends Record<string, any>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (name: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const register = (name: keyof T) => {
    return {
      name: name as string,
      value: values[name] || '',
      onChange: (e: any) => handleChange(name, e?.target ? e.target.value : e),
    };
  };

  const handleSubmit = (onSubmit: (data: T) => Promise<void> | void) => {
    return async (e?: { preventDefault?: () => void }) => {
      e?.preventDefault?.();
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (err: any) {
        setErrors({ _form: err?.message || 'An error occurred' } as any);
      } finally {
        setIsSubmitting(false);
      }
    };
  };

  return { values, errors, isSubmitting, register, setValues, setErrors, handleSubmit };
}

/**
 * Tiny alternative to TanStack Query.
 */
export function useApiQuery<T>(queryFn: () => Promise<T>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await queryFn();
      setData(result);
      return result;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, deps);

  return { data, isLoading, error, refetch };
}
