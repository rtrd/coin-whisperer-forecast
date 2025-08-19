import React, { memo, useMemo } from 'react';
import { OptimizedLazyLoader } from './OptimizedLazyLoader';
import { useDebouncedCallback } from '@/hooks/usePerformanceOptimization';
import { MarketDataWidget } from './MarketDataWidget';

export const OptimizedMarketDataWidget = memo<any>(() => {
  return (
    <OptimizedLazyLoader
      minHeight="600px"
      rootMargin="100px"
      delay={200}
      errorBoundary={true}
    >
      <div>Market data loading...</div>
    </OptimizedLazyLoader>
  );
});

OptimizedMarketDataWidget.displayName = 'OptimizedMarketDataWidget';