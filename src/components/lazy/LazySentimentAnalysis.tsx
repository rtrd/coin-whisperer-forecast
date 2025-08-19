import React, { lazy } from 'react';
import { LazyLoadWrapper } from '@/components/LazyLoadWrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SentimentAnalysis = lazy(() => 
  import('@/components/SentimentAnalysis').then(module => ({ 
    default: module.SentimentAnalysis 
  }))
);

const SentimentAnalysisSkeleton = () => (
  <Card className="bg-gray-800/50 border-gray-700">
    <CardHeader>
      <CardTitle className="text-white">Sentiment Analysis</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="text-center">
          <Skeleton className="h-16 w-16 rounded-full mx-auto" />
          <Skeleton className="h-4 w-20 mx-auto mt-2" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="text-center">
              <Skeleton className="h-8 w-12 mx-auto" />
              <Skeleton className="h-3 w-16 mx-auto mt-1" />
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

interface LazySentimentAnalysisProps {
  crypto: string;
  sentimentData?: any;
}

export const LazySentimentAnalysis: React.FC<LazySentimentAnalysisProps> = (props) => {
  return (
    <LazyLoadWrapper
      fallback={<SentimentAnalysisSkeleton />}
      className="mb-6"
    >
      <SentimentAnalysis {...props} />
    </LazyLoadWrapper>
  );
};