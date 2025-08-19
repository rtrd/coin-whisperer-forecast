import React, { lazy } from 'react';
import { LazyLoadWrapper } from '@/components/LazyLoadWrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TechnicalAnalysis = lazy(() => 
  import('@/components/TechnicalAnalysis').then(module => ({ 
    default: module.TechnicalAnalysis 
  }))
);

const TechnicalAnalysisSkeleton = () => (
  <Card className="bg-gray-800/50 border-gray-700">
    <CardHeader>
      <CardTitle className="text-white">Technical Analysis</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

interface LazyTechnicalAnalysisProps {
  data: Array<{
    timestamp: number;
    price: number;
    volume?: number;
  }> | null;
  isLoading: boolean;
}

export const LazyTechnicalAnalysis: React.FC<LazyTechnicalAnalysisProps> = (props) => {
  return (
    <LazyLoadWrapper
      fallback={<TechnicalAnalysisSkeleton />}
      className="mb-6"
    >
      <TechnicalAnalysis {...props} />
    </LazyLoadWrapper>
  );
};