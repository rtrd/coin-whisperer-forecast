import { useQuery } from '@tanstack/react-query';

// Create a simple fetch wrapper since we don't have Supabase client
const invokeEdgeFunction = async (functionName: string, body: any) => {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${functionName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Function invocation failed: ${response.statusText}`);
  }

  return response.json();
};

export interface OnChainMetrics {
  totalHolders: number;
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
        // Fetch current holder data
        const holdersData = await invokeEdgeFunction('coingecko-proxy', { 
          endpoint: 'holders',
          network,
          contractAddress 
        });

        // Fetch top holders for concentration
        const topHoldersData = await invokeEdgeFunction('coingecko-proxy', { 
          endpoint: 'top-holders',
          network,
          contractAddress 
        });

        const currentHolders = holdersData?.total_holders || 0;
        const holders24hAgo = holdersData?.holders_24h_ago || currentHolders;
        const holdersGrowth24h = holders24hAgo > 0 
          ? ((currentHolders - holders24hAgo) / holders24hAgo) * 100 
          : 0;

        // Calculate top 10 holder concentration
        const topHolders = topHoldersData?.items || [];
        const topHolderConcentration = topHolders
          .slice(0, 10)
          .reduce((sum: number, holder: any) => sum + (holder.percentage || 0), 0);

        // Determine trend
        let holderTrend: 'increasing' | 'decreasing' | 'stable' = 'stable';
        if (holdersGrowth24h > 2) holderTrend = 'increasing';
        else if (holdersGrowth24h < -2) holderTrend = 'decreasing';

        return {
          totalHolders: currentHolders,
          holdersGrowth24h: parseFloat(holdersGrowth24h.toFixed(2)),
          topHolderConcentration: parseFloat(topHolderConcentration.toFixed(2)),
          holderTrend,
          lastUpdated: new Date().toISOString()
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
