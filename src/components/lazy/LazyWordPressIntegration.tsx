import React, { lazy } from 'react';
import { LazyLoadWrapper } from '@/components/LazyLoadWrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const WordPressIntegration = lazy(() => 
  import('@/components/WordPressIntegrationOptimized')
);

const WordPressSkeleton = () => (
  <Card className="mb-8 bg-gray-800/50 border-gray-700 shadow-2xl">
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle className="text-white">Our Latest Articles</CardTitle>
          <Badge className="bg-green-600">Live Feed</Badge>
        </div>
        <Skeleton className="h-9 w-32" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export const LazyWordPressIntegration: React.FC = () => {
  return (
    <LazyLoadWrapper
      fallback={<WordPressSkeleton />}
      className="mb-8"
    >
      <WordPressIntegration />
    </LazyLoadWrapper>
  );
};