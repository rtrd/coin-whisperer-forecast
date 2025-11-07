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

const API_KEY = import.meta.env.VITE_LUNAR_API;

export const useLunarCrushMetrics = (tokenSymbol: string) => {
  return useQuery({
    queryKey: ['lunarcrush-metrics', tokenSymbol],
    queryFn: async (): Promise<LunarCrushMetrics> => {
      try {
        const response = await fetch(
          `https://lunarcrush.com/api4/public/coins/${tokenSymbol}/v1`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${API_KEY}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`LunarCrush API error: ${response.status}`);
        }

        const data = await response.json();
        
        return {
          galaxy_score: data.galaxy_score,
          alt_rank: data.alt_rank,
          social_volume_24h: data.social_volume_24h,
          social_engagement_24h: data.social_engagement_24h,
          social_contributors: data.social_contributors,
          social_dominance: data.social_dominance,
          sentiment: data.sentiment,
          price_score: data.price_score,
          bullish_sentiment: data.bullish_sentiment,
          bearish_sentiment: data.bearish_sentiment,
        };
      } catch (error) {
        console.error('LunarCrush metrics fetch error:', error);
        throw error; // Don't return mock data, let the component handle the error
      }
    },
    enabled: !!tokenSymbol,
    staleTime: 900000, // 15 minutes
    retry: 1,
  });
};
