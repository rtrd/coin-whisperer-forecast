import React, { lazy } from 'react';
import { LazyLoadWrapper } from '@/components/LazyLoadWrapper';
import { PredictionSkeleton } from '@/components/SkeletonData';

const LiveAIPredictions = lazy(() => 
  import('@/components/LiveAIPredictions').then(module => ({ 
    default: module.LiveAIPredictions 
  }))
);

export const LazyLiveAIPredictions: React.FC = () => {
  return (
    <LazyLoadWrapper
      fallback={<PredictionSkeleton />}
      className="mb-8"
    >
      <LiveAIPredictions />
    </LazyLoadWrapper>
  );
};