import React, { lazy } from 'react';
import { LazyLoadWrapper } from '@/components/LazyLoadWrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PriceChart = lazy(() => 
  import('@/components/PriceChart').then(module => ({ 
    default: module.PriceChart 
  }))
);

const PriceChartSkeleton = () => (
  <Card className="bg-gray-800/50 border-gray-700">
    <CardHeader>
      <CardTitle className="text-white flex items-center gap-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </CardTitle>
    </CardHeader>
    <CardContent>
      <Skeleton className="h-80 w-full" />
      <div className="flex justify-center mt-4 gap-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
      </div>
    </CardContent>
  </Card>
);

interface LazyPriceChartProps {
  data: Array<{
    timestamp: number;
    price: number;
    volume?: number;
  }> | null;
  prediction: Array<{
    timestamp: number;
    predictedPrice: number;
    confidence: number;
  }> | null;
  isLoading: boolean;
  crypto: string;
  onClearPrediction?: () => void;
}

export const LazyPriceChart: React.FC<LazyPriceChartProps> = (props) => {
  return (
    <LazyLoadWrapper
      fallback={<PriceChartSkeleton />}
      className="mb-6"
    >
      <PriceChart {...props} />
    </LazyLoadWrapper>
  );
};