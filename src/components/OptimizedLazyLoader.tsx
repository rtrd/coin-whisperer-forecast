import React, { Suspense, lazy, memo, useCallback, useMemo } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Skeleton } from '@/components/ui/skeleton';

interface OptimizedLazyLoaderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  delay?: number;
  minHeight?: string;
  errorBoundary?: boolean;
}

// Default fallback component
const DefaultFallback = memo(({ minHeight = "200px" }: { minHeight?: string }) => (
  <div className="space-y-4 p-4" style={{ minHeight }}>
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-32 w-full" />
  </div>
));

// Error fallback component
const ErrorFallback = memo(({ error, retry }: { error: Error; retry: () => void }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <p className="text-muted-foreground mb-4">Failed to load content</p>
    <button 
      onClick={retry}
      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
    >
      Try Again
    </button>
  </div>
));

// Enhanced lazy loader with performance optimizations
export const OptimizedLazyLoader = memo<OptimizedLazyLoaderProps>(({
  children,
  fallback,
  className = "min-h-[200px]",
  threshold = 0.1,
  rootMargin = "100px",
  delay = 0,
  minHeight = "200px",
  errorBoundary = true
}) => {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce: true
  });

  const [hasError, setHasError] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Memoized fallback component
  const memoizedFallback = useMemo(() => 
    fallback || <DefaultFallback minHeight={minHeight} />, 
    [fallback, minHeight]
  );

  // Delayed loading for better UX
  const [shouldLoad, setShouldLoad] = React.useState(false);
  
  React.useEffect(() => {
    if (isIntersecting && !shouldLoad) {
      if (delay > 0) {
        const timer = setTimeout(() => setShouldLoad(true), delay);
        return () => clearTimeout(timer);
      } else {
        setShouldLoad(true);
      }
    }
  }, [isIntersecting, shouldLoad, delay]);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  const handleRetry = useCallback(() => {
    setHasError(false);
    setShouldLoad(false);
    // Trigger reload after a brief delay
    setTimeout(() => setShouldLoad(true), 100);
  }, []);

  if (hasError && errorBoundary) {
    return (
      <div ref={ref} className={className}>
        <ErrorFallback error={new Error('Component failed to load')} retry={handleRetry} />
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      {shouldLoad ? (
        <Suspense fallback={memoizedFallback}>
          <ErrorBoundaryWrapper onError={errorBoundary ? handleError : undefined}>
            {children}
          </ErrorBoundaryWrapper>
        </Suspense>
      ) : (
        memoizedFallback
      )}
    </div>
  );
});

// Simple error boundary wrapper
class ErrorBoundaryWrapper extends React.Component<{
  children: React.ReactNode;
  onError?: () => void;
}> {
  componentDidCatch(error: Error) {
    console.error('OptimizedLazyLoader Error:', error);
    this.props.onError?.();
  }

  render() {
    return this.props.children;
  }
}

// Higher-order component for creating optimized lazy components
export function createOptimizedLazyComponent<T extends Record<string, any>>(
  importFn: () => Promise<{ default: React.ComponentType<any> }>,
  options?: Partial<OptimizedLazyLoaderProps>
) {
  const LazyComponent = lazy(importFn);
  
  return memo<T>((props) => (
    <OptimizedLazyLoader {...options}>
      <LazyComponent {...(props as any)} />
    </OptimizedLazyLoader>
  ));
}

// Pre-built optimized lazy components for common heavy components
export const OptimizedLazyChart = createOptimizedLazyComponent(
  () => import('@/components/PriceChart').then(m => ({ default: m.PriceChart })),
  { minHeight: "400px", rootMargin: "200px" }
);

export const OptimizedLazyTable = createOptimizedLazyComponent(
  () => import('@/components/MarketDataTable').then(m => ({ default: m.MarketDataTable })),
  { minHeight: "300px", rootMargin: "150px" }
);

export const OptimizedLazyAI = createOptimizedLazyComponent(
  () => import('@/components/AITradingSignals').then(m => ({ default: m.AITradingSignals })),
  { minHeight: "500px", rootMargin: "250px", delay: 300 }
);