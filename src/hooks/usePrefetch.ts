import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

// Hook to prefetch data for likely next pages
export const usePrefetch = () => {
  const queryClient = useQueryClient();

  const prefetchPage = useCallback(async (
    path: string, 
    queryKey: string[], 
    queryFn: () => Promise<any>
  ) => {
    // Only prefetch if we don't already have the data
    if (!queryClient.getQueryData(queryKey)) {
      try {
        await queryClient.prefetchQuery({
          queryKey,
          queryFn,
          staleTime: 5 * 60 * 1000, // 5 minutes
        });
      } catch (error) {
        // Ignore prefetch failures
        console.debug('Prefetch failed for', path, error);
      }
    }
  }, [queryClient]);

  const prefetchTokenData = useCallback((tokenId: string) => {
    prefetchPage(
      `/token/${tokenId}`,
      ['token', tokenId],
      () => fetch(`/api/token/${tokenId}`).then(res => res.json())
    );
  }, [prefetchPage]);

  const prefetchCriticalData = useCallback(() => {
    // Prefetch most commonly accessed data
    const criticalQueries = [
      {
        key: ['crypto-data'],
        fn: () => fetch('/api/crypto-data').then(res => res.json())
      },
      {
        key: ['market-data'],
        fn: () => fetch('/api/market-data').then(res => res.json())
      }
    ];

    criticalQueries.forEach(({ key, fn }) => {
      if (!queryClient.getQueryData(key)) {
        queryClient.prefetchQuery({
          queryKey: key,
          queryFn: fn,
          staleTime: 2 * 60 * 1000, // 2 minutes for market data
        });
      }
    });
  }, [queryClient, prefetchPage]);

  // Auto-prefetch critical data on mount
  useEffect(() => {
    const timer = setTimeout(prefetchCriticalData, 1000);
    return () => clearTimeout(timer);
  }, [prefetchCriticalData]);

  return {
    prefetchPage,
    prefetchTokenData,
    prefetchCriticalData
  };
};

// Hook for link hover prefetching
export const useHoverPrefetch = () => {
  const { prefetchTokenData } = usePrefetch();

  const handleLinkHover = useCallback((path: string) => {
    const tokenMatch = path.match(/\/token\/([^\/]+)/);
    if (tokenMatch) {
      prefetchTokenData(tokenMatch[1]);
    }
  }, [prefetchTokenData]);

  return { handleLinkHover };
};