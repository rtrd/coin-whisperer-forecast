
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
  community_data?: {
    twitter_followers?: number;
    reddit_average_posts_48h?: number;
    reddit_average_comments_48h?: number;
    reddit_subscribers?: number;
    reddit_accounts_active_48h?: number;
    telegram_channel_user_count?: number;
  };
  developer_data?: {
    forks?: number;
    stars?: number;
    subscribers?: number;
    total_issues?: number;
    closed_issues?: number;
    pull_requests_merged?: number;
    pull_request_contributors?: number;
    commit_count_4_weeks?: number;
    code_additions_deletions_4_weeks?: {
      additions?: number;
      deletions?: number;
    };
  };
  links?: {
    homepage?: string[];
    blockchain_site?: string[];
    official_forum_url?: string[];
    chat_url?: string[];
    announcement_url?: string[];
    twitter_screen_name?: string;
    facebook_username?: string;
    subreddit_url?: string;
    repos_url?: { 
      github?: string[];
    };
  };
  market_data?: {
    price_change_percentage_1h_in_currency?: { usd?: number };
    price_change_percentage_14d_in_currency?: { usd?: number };
    price_change_percentage_60d_in_currency?: { usd?: number };
    price_change_percentage_200d_in_currency?: { usd?: number };
    price_change_percentage_1y_in_currency?: { usd?: number };
    market_cap_change_24h?: number;
    fully_diluted_valuation?: { usd?: number };
    last_updated?: string;
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
