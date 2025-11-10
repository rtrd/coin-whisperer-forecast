import { useQuery } from '@tanstack/react-query';

// Create a simple fetch wrapper that works in all environments (no env URL required)
const invokeEdgeFunction = async (functionName: string, body: any) => {
  const url = `/functions/v1/${functionName}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (anon) headers['Authorization'] = `Bearer ${anon}`;

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Function invoke failed (${response.status}): ${text || response.statusText}`);
  }

  return response.json();
};

export interface OnChainMetrics {
  totalHolders: number;
  holders24hAgo: number;
  holdersGrowth24h: number;
  topHolderConcentration: number;
  holderTrend: 'increasing' | 'decreasing' | 'stable';
  lastUpdated: string;
}

export const useOnChainMetrics = (contractAddress?: string, network?: string) => {
  return useQuery({
    queryKey: ['onchain-metrics', contractAddress, network],
    queryFn: async (): Promise<OnChainMetrics | null> => {
      if (!contractAddress || !network) {
        return null;
      }

      try {
        console.debug('[onchain] fetching', { network, contract: contractAddress?.slice(0, 8) });

        const [holdersRes, topRes] = await Promise.allSettled([
          invokeEdgeFunction('coingecko-proxy', {
            endpoint: 'holders',
            network,
            contractAddress,
          }),
          invokeEdgeFunction('coingecko-proxy', {
            endpoint: 'top-holders',
            network,
            contractAddress,
          }),
        ]);

        const holdersData = holdersRes.status === 'fulfilled' ? holdersRes.value : null;
        const topHoldersData = topRes.status === 'fulfilled' ? topRes.value : null;

        const currentHolders = holdersData?.total_holders ?? 0;
        const holders24hAgo = holdersData?.holders_24h_ago ?? currentHolders;
        const holdersGrowth24h = holders24hAgo > 0
          ? ((currentHolders - holders24hAgo) / holders24hAgo) * 100
          : 0;

        const topHolders = topHoldersData?.items ?? [];
        let topHolderConcentration = topHolders
          .slice(0, 10)
          .reduce((sum: number, holder: any) => {
            const p = holder?.percentage ?? holder?.percent ?? holder?.pct ?? holder?.share;
            const num = typeof p === 'string' ? parseFloat(p) : (typeof p === 'number' ? p : 0);
            return sum + (isFinite(num) ? num : 0);
          }, 0);
        if ((!topHolders || topHolders.length === 0) && holdersData?.distribution?.top_10) {
          const fallbackPct = holdersData.distribution.top_10;
          const num = typeof fallbackPct === 'string' ? parseFloat(fallbackPct) : (typeof fallbackPct === 'number' ? fallbackPct : 0);
          topHolderConcentration = isFinite(num) ? num : 0;
        }

        // Determine trend
        let holderTrend: 'increasing' | 'decreasing' | 'stable' = 'stable';
        if (holdersGrowth24h > 2) holderTrend = 'increasing';
        else if (holdersGrowth24h < -2) holderTrend = 'decreasing';

return {
  totalHolders: currentHolders,
  holders24hAgo,
  holdersGrowth24h: parseFloat(holdersGrowth24h.toFixed(2)),
  topHolderConcentration: parseFloat(topHolderConcentration.toFixed(2)),
  holderTrend,
  lastUpdated: new Date().toISOString(),
};
      } catch (error) {
        console.error('Error fetching on-chain metrics:', error);
        return null;
      }
    },
    enabled: !!contractAddress && !!network,
    staleTime: 60000, // Cache for 60 seconds
    retry: 2
  });
};
