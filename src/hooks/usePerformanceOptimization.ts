import { useEffect, useCallback, useMemo, useState } from 'react';
import { performanceService } from '@/services/performanceService';

// Hook for performance optimization
export const usePerformanceOptimization = () => {
  useEffect(() => {
    try {
      console.log('Initializing performance optimizations...');
      // Initialize performance optimizations
      performanceService.optimizeImages();
      console.log('Performance optimizations initialized successfully');
    } catch (error) {
      console.warn('Performance optimization initialization failed:', error);
    }
    
    // Cleanup on unmount
    return () => {
      try {
        performanceService.cleanup();
      } catch (error) {
        console.warn('Performance cleanup failed:', error);
      }
    };
  }, []);

  const getCachedData = useCallback(
    <T>(key: string, fetcher: () => Promise<T>) => 
      performanceService.getCachedData(key, fetcher),
    []
  );

  const clearCache = useCallback(
    (key?: string) => performanceService.clearCache(key),
    []
  );

  const prefetchResources = useCallback(
    (urls: string[]) => performanceService.prefetchResources(urls),
    []
  );

  return {
    getCachedData,
    clearCache,
    prefetchResources
  };
};

// Hook for debounced API calls
export const useDebouncedCallback = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T => {
  const debouncedCallback = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    
    return ((...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => callback(...args), delay);
    }) as T;
  }, [callback, delay]);

  useEffect(() => {
    return () => {
      // Cleanup timeout on unmount
    };
  }, []);

  return debouncedCallback;
};

// Hook for optimized re-renders
export const useOptimizedState = <T>(initialValue: T) => {
  const [state, setState] = useState(initialValue);
  
  const optimizedSetState = useCallback((newValue: T | ((prev: T) => T)) => {
    setState(prev => {
      const nextValue = typeof newValue === 'function' 
        ? (newValue as (prev: T) => T)(prev)
        : newValue;
      
      // Only update if value actually changed
      return Object.is(prev, nextValue) ? prev : nextValue;
    });
  }, []);

  return [state, optimizedSetState] as const;
};

// Hook for intersection observer with performance optimizations
export const useOptimizedIntersectionObserver = (
  options: IntersectionObserverInit & { 
    throttle?: number;
    onIntersect?: (entry: IntersectionObserverEntry) => void;
  }
) => {
  const [ref, setRef] = useState<Element | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!ref) return;

    let timeoutId: NodeJS.Timeout;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        
        if (options.throttle && options.throttle > 0) {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            setIsIntersecting(entry.isIntersecting);
            options.onIntersect?.(entry);
          }, options.throttle);
        } else {
          setIsIntersecting(entry.isIntersecting);
          options.onIntersect?.(entry);
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px',
        root: options.root
      }
    );

    observer.observe(ref);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [ref, options.threshold, options.rootMargin, options.root, options.throttle]);

  return { ref: setRef, isIntersecting };
};