import { useQuery } from '@tanstack/react-query';

export interface LunarCrushMetrics {
  galaxy_score?: number;
  alt_rank?: number;
  social_volume_24h?: number;
  social_engagement_24h?: number;
  social_contributors?: number;
  social_dominance?: number;
  sentiment?: number;
  price_score?: number;
  bullish_sentiment?: number;
  bearish_sentiment?: number;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export const useLunarCrushMetrics = (tokenSymbol: string) => {
  return useQuery({
    queryKey: ['lunarcrush-metrics', tokenSymbol],
    queryFn: async (): Promise<LunarCrushMetrics> => {
      try {
        const response = await fetch(
          `${SUPABASE_URL}/functions/v1/lunarcrush-proxy`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tokenSymbol }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `LunarCrush proxy error: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error('LunarCrush metrics fetch error:', error);
        throw error;
      }
    },
    enabled: !!tokenSymbol,
    staleTime: 900000, // 15 minutes
    retry: 1,
  });
};
