import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface ErrorState {
  error: Error | null;
  isError: boolean;
  errorMessage: string;
}

export interface UseErrorHandlerReturn extends ErrorState {
  handleError: (error: Error | string, options?: ErrorHandlerOptions) => void;
  clearError: () => void;
  retryAction: (() => void) | null;
  setRetryAction: (action: (() => void) | null) => void;
}

export interface ErrorHandlerOptions {
  showToast?: boolean;
  toastTitle?: string;
  logError?: boolean;
  retryAction?: () => void;
  silent?: boolean;
}

export const useErrorHandler = (): UseErrorHandlerReturn => {
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    isError: false,
    errorMessage: ''
  });
  const [retryAction, setRetryAction] = useState<(() => void) | null>(null);

  const handleError = useCallback((
    error: Error | string, 
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast = true,
      toastTitle = 'Error',
      logError = true,
      retryAction: retryFn,
      silent = false
    } = options;

    const errorObj = typeof error === 'string' ? new Error(error) : error;
    const errorMessage = errorObj.message || 'An unexpected error occurred';

    // Update error state
    setErrorState({
      error: errorObj,
      isError: true,
      errorMessage
    });

    // Set retry action if provided
    if (retryFn) {
      setRetryAction(() => retryFn);
    }

    // Log error to console
    if (logError) {
      console.error('Error handled:', errorObj);
    }

    // Show toast notification
    if (showToast && !silent) {
      toast.error(toastTitle, {
        description: errorMessage,
        action: retryFn ? {
          label: 'Retry',
          onClick: retryFn
        } : undefined
      });
    }

    // Log to external error reporting service if available
    if (typeof window !== 'undefined' && (window as any).errorReporting) {
      (window as any).errorReporting.captureException(errorObj);
    }
  }, []);

  const clearError = useCallback(() => {
    setErrorState({
      error: null,
      isError: false,
      errorMessage: ''
    });
    setRetryAction(null);
  }, []);

  return {
    ...errorState,
    handleError,
    clearError,
    retryAction,
    setRetryAction
  };
};

// Utility function for async error handling
export const withErrorHandling = async <T>(
  asyncFn: () => Promise<T>,
  errorHandler: (error: Error) => void,
  options?: ErrorHandlerOptions
): Promise<T | null> => {
  try {
    return await asyncFn();
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    errorHandler(errorObj);
    return null;
  }
};

// Error boundary hook for functional components
export const useAsyncError = () => {
  const [, setError] = useState();
  return useCallback(
    (error: Error) => {
      setError(() => {
        throw error;
      });
    },
    [setError]
  );
};