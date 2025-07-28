
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
        sparkline: 'false',
        price_change_percentage: '24h,7d,30d'
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

  async getWordPressPost<T = any[]>(): Promise<T> {
  try {
    const postsResponse = await fetch("https://blog.pumpparade.com/wp-json/wp/v2/posts?_embed&per_page=100");
    if (!postsResponse.ok) {
      throw new Error(`WordPress API error! status: ${postsResponse.status}`);
    }

    const posts = await postsResponse.json();
    console.log("Fetched posts:", posts);

    // Collect all unique tag IDs from posts
    const allTagIds = Array.from(
      new Set(posts.flatMap((post: any) => post.tags))
    );

    let tagMap: Record<number, string> = {};

    if (allTagIds.length > 0) {
      const tagsUrl = `https://blog.pumpparade.com/wp-json/wp/v2/tags?include=${allTagIds.join(",")}`;
      const tagsResponse = await fetch(tagsUrl);
      const tags = await tagsResponse.json();
      tagMap = tags.reduce((acc: Record<number, string>, tag: any) => {
        acc[tag.id] = tag.name;
        return acc;
      }, {});
    }

    // Attach tag names to each post
    const postsWithTagNames = posts.map((post: any) => ({
      ...post,
      tagNames: post.tags.map((tagId: number) => tagMap[tagId] || "")
    }));

    return postsWithTagNames as T;

  } catch (error) {
    console.error("WordPress fetch error:", error);
    throw error;
  }
}

  async getFearGreedIndex(): Promise<{ value: number; classification: string }> {
    try {
      const response = await fetch('https://api.alternative.me/fng/');
      if (!response.ok) {
        throw new Error(`Fear & Greed API error: ${response.status}`);
      }
      
      const data = await response.json();
      const latestData = data.data[0];
      
      return {
        value: parseInt(latestData.value),
        classification: latestData.value_classification
      };
    } catch (error) {
      console.error('Fear & Greed Index fetch error:', error);
      return { value: 52, classification: 'Neutral' }; // Fallback
    }
  }

  async getDefiTVL(): Promise<{ tvl: number; change24h: number }> {
    try {
      const response = await fetch('https://api.llama.fi/v2/chains');
      if (!response.ok) {
        throw new Error(`DeFi TVL API error: ${response.status}`);
      }
      
      const data = await response.json();
      const totalTvl = data.reduce((sum: number, chain: any) => sum + (chain.tvl || 0), 0);
      
      return {
        tvl: totalTvl,
        change24h: 3.2 // API doesn't provide 24h change, using placeholder
      };
    } catch (error) {
      console.error('DeFi TVL fetch error:', error);
      return { tvl: 127800000000, change24h: 3.2 }; // Fallback
    }
  }

  async getEthGasPrice(): Promise<{ gasPrice: number; trend: 'low' | 'normal' | 'high' }> {
    try {
      const response = await fetch('https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=YourApiKeyToken');
      if (!response.ok) {
        throw new Error(`Etherscan API error: ${response.status}`);
      }
      
      const data = await response.json();
      const gasPrice = parseInt(data.result.SafeGasPrice);
      
      let trend: 'low' | 'normal' | 'high' = 'normal';
      if (gasPrice < 20) trend = 'low';
      else if (gasPrice > 50) trend = 'high';
      
      return { gasPrice, trend };
    } catch (error) {
      console.error('ETH Gas Price fetch error:', error);
      return { gasPrice: 25, trend: 'normal' }; // Fallback
    }
  }

}


export const apiService = new ApiService();
