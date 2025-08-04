import React, { lazy, useState } from 'react';
import { LazyLoadWrapper } from '@/components/LazyLoadWrapper';
import { AITradingSignalsSkeleton } from '@/components/SkeletonData';

const AITradingSignals = lazy(() => 
  import('@/components/AITradingSignals').then(module => ({ 
    default: module.AITradingSignals 
  }))
);

export const LazyAITradingSignals: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <LazyLoadWrapper
      fallback={<AITradingSignalsSkeleton />}
      className="mb-6"
    >
      <div onLoad={() => setIsLoaded(true)}>
        <AITradingSignals />
      </div>
    </LazyLoadWrapper>
  );
};