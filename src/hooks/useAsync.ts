import { useState, useEffect, useCallback, useRef } from 'react';
import { useErrorHandler } from './useErrorHandler';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export interface UseAsyncOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  showErrorToast?: boolean;
}

export interface UseAsyncReturn<T> extends AsyncState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
  cancel: () => void;
}

export const useAsync = <T = any>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options: UseAsyncOptions = {}
): UseAsyncReturn<T> => {
  const {
    immediate = false,
    onSuccess,
    onError,
    showErrorToast = true
  } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const { handleError } = useErrorHandler();
  const cancelRef = useRef<boolean>(false);
  const mountedRef = useRef<boolean>(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      cancelRef.current = true;
    };
  }, []);

  const execute = useCallback(async (...args: any[]): Promise<T | null> => {
    if (!mountedRef.current) return null;

    cancelRef.current = false;
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await asyncFunction(...args);
      
      if (!cancelRef.current && mountedRef.current) {
        setState({
          data: result,
          loading: false,
          error: null
        });

        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      }
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      
      if (!cancelRef.current && mountedRef.current) {
        setState({
          data: null,
          loading: false,
          error: errorObj
        });

        if (onError) {
          onError(errorObj);
        } else if (showErrorToast) {
          handleError(errorObj, { showToast: true });
        }
      }
    }

    return null;
  }, [asyncFunction, onSuccess, onError, showErrorToast, handleError]);

  const reset = useCallback(() => {
    if (mountedRef.current) {
      setState({
        data: null,
        loading: false,
        error: null
      });
    }
  }, []);

  const cancel = useCallback(() => {
    cancelRef.current = true;
    if (mountedRef.current) {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    ...state,
    execute,
    reset,
    cancel
  };
};

// Hook for handling multiple async operations
export const useAsyncQueue = () => {
  const [queue, setQueue] = useState<Array<{ id: string; promise: Promise<any> }>>([]);
  const [loading, setLoading] = useState(false);

  const addToQueue = useCallback(async <T>(
    id: string,
    asyncFn: () => Promise<T>
  ): Promise<T | null> => {
    const promise = asyncFn();
    
    setQueue(prev => [...prev, { id, promise }]);
    setLoading(true);

    try {
      const result = await promise;
      return result;
    } catch (error) {
      throw error;
    } finally {
      setQueue(prev => prev.filter(item => item.id !== id));
      setLoading(prev => {
        const newQueue = queue.filter(item => item.id !== id);
        return newQueue.length > 0;
      });
    }
  }, [queue]);

  const clearQueue = useCallback(() => {
    setQueue([]);
    setLoading(false);
  }, []);

  return {
    queue,
    loading,
    addToQueue,
    clearQueue,
    queueLength: queue.length
  };
};