import { useQuery } from '@tanstack/react-query';

// Enhanced fetch wrapper with better error handling and logging
const invokeEdgeFunction = async (functionName: string, body: any) => {
  const url = `/functions/v1/${functionName}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (anon) headers['Authorization'] = `Bearer ${anon}`;

  console.log(`[onchain] Invoking edge function: ${functionName}`, { url, body });

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    
    // Special handling for 404 - function not deployed
    if (response.status === 404) {
      console.error(`[onchain] Edge function not found (404): ${functionName}. Ensure the function is deployed.`);
      throw new Error(`Edge function '${functionName}' not deployed or not accessible`);
    }
    
    console.error(`[onchain] Edge function error (${response.status}):`, text);
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
  holderDistribution?: {
    whales: number;
    investors: number;
    retail: number;
  };
  transactions24h?: number;
  activeAddresses24h?: number;
  networkActivity?: number;
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
        console.log('[onchain] Fetching metrics for:', { network, contractAddress });

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

        console.log('[onchain] API responses:', { 
          holdersStatus: holdersRes.status, 
          topStatus: topRes.status,
          holdersData: holdersRes.status === 'fulfilled' ? holdersRes.value : holdersRes.reason,
          topData: topRes.status === 'fulfilled' ? topRes.value : topRes.reason
        });

        const holdersData = holdersRes.status === 'fulfilled' ? holdersRes.value : null;
        const topHoldersData = topRes.status === 'fulfilled' ? topRes.value : null;
        
        // Check for API errors
        if (holdersData?.error || topHoldersData?.error) {
          console.error('[onchain] API returned errors:', {
            holdersError: holdersData?.error,
            topHoldersError: topHoldersData?.error
          });
        }

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

        // Parse holder distribution from API data
        const distributionData = holdersData?.distribution;
        let holderDistribution;
        if (distributionData) {
          // Calculate whales (>1%), investors (0.1-1%), retail (<0.1%)
          const top10 = parseFloat(distributionData.top_10 || 0);
          const top50 = parseFloat(distributionData.top_50 || 0);
          const top100 = parseFloat(distributionData.top_100 || 0);
          
          holderDistribution = {
            whales: top10,
            investors: Math.max(0, top50 - top10),
            retail: Math.max(0, 100 - top100),
          };
        }

        return {
          totalHolders: currentHolders,
          holders24hAgo,
          holdersGrowth24h: parseFloat(holdersGrowth24h.toFixed(2)),
          topHolderConcentration: parseFloat(topHolderConcentration.toFixed(2)),
          holderTrend,
          holderDistribution,
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
