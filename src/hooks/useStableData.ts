import { useRef, useCallback, useEffect } from 'react';

/**
 * Hook to prevent data fetching race conditions and ensure stable state management
 */
export const useStableData = <T>(
  fetcher: () => Promise<T>,
  dependencies: any[] = []
) => {
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);
  
  const stableFetcher = useCallback(async (): Promise<T | null> => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new controller
    abortControllerRef.current = new AbortController();
    
    try {
      const result = await fetcher();
      
      // Only return result if component is still mounted and request wasn't aborted
      if (isMountedRef.current && !abortControllerRef.current.signal.aborted) {
        return result;
      }
      return null;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return null; // Request was cancelled, ignore
      }
      throw error; // Re-throw non-abort errors
    }
  }, dependencies);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);
  
  return stableFetcher;
};

/**
 * Hook to debounce function calls and prevent excessive API requests
 */
export const useDebounceCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  const debouncedCallback = useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]) as T;
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return debouncedCallback;
};