
import { CryptoToken } from '@/types/crypto';
import { TokenInfo } from '@/hooks/useTokenInfo';

const API_KEY = import.meta.env.VITE_TOKEN_KEY;

class ApiService {
  private baseUrl = 'https://api.coingecko.com/api/v3';

  async getAllCryptos(): Promise<CryptoToken[]> {
    try {
      const queryParams = new URLSearchParams({
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: '200',
        page: '1',
        sparkline: 'false'
      });

      const response = await fetch(`${this.baseUrl}/coins/markets?${queryParams.toString()}`, {
        headers: {
          accept: 'application/json',
          'key': API_KEY || ''
        }
      });

      if (!response.ok) {
        throw new Error(`API error! status: ${response.status}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("API fetch error:", error);
      throw error;
    }
  }

  async getTokenInfo(tokenId: string): Promise<TokenInfo> {
    try {
      console.log(`Fetching token info for: ${tokenId}`);
      
      // First try the direct API call (will likely fail due to CORS)
      let response;
      try {
        response = await fetch(`${this.baseUrl}/coins/${tokenId}`, {
          headers: {
            accept: 'application/json',
            'key': API_KEY || ''
          }
        });
      } catch (corsError) {
        console.log('Direct API call failed (CORS), this is expected in browser environment');
        throw new Error('CORS_ERROR');
      }

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Token '${tokenId}' not found`);
        }
        throw new Error(`API error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Successfully fetched token info for ${tokenId}:`, data);
      
      return {
        id: data.id,
        symbol: data.symbol?.toUpperCase() || tokenId.toUpperCase(),
        name: data.name || tokenId,
        description: data.description?.en,
        image: data.image?.large || data.image?.small,
        current_price: data.market_data?.current_price?.usd,
        market_cap: data.market_data?.market_cap?.usd,
        market_cap_rank: data.market_cap_rank,
        price_change_percentage_24h: data.market_data?.price_change_percentage_24h,
        total_volume: data.market_data?.total_volume?.usd,
        categories: data.categories,
        links: {
          homepage: data.links?.homepage?.filter(Boolean),
          twitter_screen_name: data.links?.twitter_screen_name
        }
      };
    } catch (error) {
      console.error(`Token info fetch error for ${tokenId}:`, error);
      throw error;
    }
  }

  async getWordPressPost<T>(): Promise<T> {
    try {
      const response = await fetch("https://blog.pumpparade.com//wp-json/wp/v2/posts");

      if (!response.ok) {
        throw new Error(`WordPress API error! status: ${response.status}`);
      }

      const data: T = await response.json();
      return data;
    } catch (error) {
      console.error("WordPress fetch error:", error);    
      throw error;
    }
  }
}

export const apiService = new ApiService();
