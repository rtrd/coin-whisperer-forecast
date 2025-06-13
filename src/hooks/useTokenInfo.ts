
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/apiService';

export interface TokenInfo {
  id: string;
  symbol: string;
  name: string;
  description?: string;
  image?: string;
  current_price?: number;
  market_cap?: number;
  market_cap_rank?: number;
  price_change_percentage_24h?: number;
  total_volume?: number;
  categories?: string[];
  links?: {
    homepage?: string[];
    twitter_screen_name?: string;
  };
}

export const useTokenInfo = (tokenId: string) => {
  return useQuery({
    queryKey: ['token-info', tokenId],
    queryFn: () => apiService.getTokenInfo(tokenId),
    enabled: !!tokenId,
    staleTime: 300000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry CORS errors or 404s
      if (error.message === 'CORS_ERROR' || error.message.includes('not found')) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: 1000,
  });
};
