import React, { lazy } from 'react';
import { LazyLoadWrapper } from '@/components/LazyLoadWrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3 } from 'lucide-react';
import { CryptoToken } from '@/types/crypto';

const MarketDataWidget = lazy(() => 
  import('@/components/MarketDataWidget').then(module => ({ 
    default: module.MarketDataWidget 
  }))
);

interface LazyMarketDataWidgetProps {
  cryptoOptions: CryptoToken[];
  AllCryptosData: CryptoToken[];
  onMarketDataFilter: (filter: any) => void;
}

const MarketDataSkeleton = () => (
  <Card className="mb-8 bg-gray-800/50 border-gray-700 shadow-2xl">
    <CardHeader>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-400" />
          <CardTitle className="text-white">Market Data</CardTitle>
          <Badge className="bg-green-600">Live Data</Badge>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24" />
        ))}
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-gray-700/30 rounded">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div>
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
            <div className="text-right">
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <Skeleton className="h-10 w-48 mx-auto" />
      </div>
    </CardContent>
  </Card>
);

export const LazyMarketDataWidget: React.FC<LazyMarketDataWidgetProps> = (props) => {
  return (
    <LazyLoadWrapper
      fallback={<MarketDataSkeleton />}
      className="mb-8"
    >
      <MarketDataWidget {...props} />
    </LazyLoadWrapper>
  );
};