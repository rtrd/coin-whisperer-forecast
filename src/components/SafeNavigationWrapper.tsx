import React, { Suspense } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { MainNavigation } from '@/components/MainNavigation';
import { Skeleton } from '@/components/ui/skeleton';

const NavigationFallback = () => (
  <div className="fixed top-0 left-0 w-full z-50 bg-slate-900 border-b border-slate-700 shadow-lg">
    <div className="container mx-auto px-6 py-2">
      <div className="flex justify-end">
        <Skeleton className="h-6 w-32 bg-gray-700" />
      </div>
    </div>
  </div>
);

export const SafeNavigationWrapper: React.FC = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<NavigationFallback />}>
        <MainNavigation />
      </Suspense>
    </ErrorBoundary>
  );
};