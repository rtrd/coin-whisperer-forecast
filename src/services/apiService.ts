import { CryptoToken } from "@/types/crypto";
import { TokenInfo } from "@/hooks/useTokenInfo";

const API_KEY = import.meta.env.VITE_TOKEN_KEY;
const SERVER_URL = import.meta.env.VITE_SERVER_URL;
class ApiService {
  private baseUrl = "https://api.coingecko.com/api/v3";

  async getAllCryptos(): Promise<CryptoToken[]> {
    try {
      // Use CoinGecko API directly since we don't have a backend server
      const response = await fetch(`${this.baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=24h`, {
        headers: {
          accept: "application/json",
          ...(API_KEY && { "x-cg-demo-api-key": API_KEY }),
        },
      });

      if (!response.ok) {
        throw new Error(`API error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform CoinGecko data to match our CryptoToken interface
      const transformedData = data.map((coin: any) => ({
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        image: coin.image,
        current_price: coin.current_price,
        market_cap: coin.market_cap,
        market_cap_rank: coin.market_cap_rank,
        total_volume: coin.total_volume,
        high_24h: coin.high_24h,
        low_24h: coin.low_24h,
        price_change_24h: coin.price_change_24h,
        price_change_percentage_24h: coin.price_change_percentage_24h,
        market_cap_change_24h: coin.market_cap_change_24h,
        market_cap_change_percentage_24h: coin.market_cap_change_percentage_24h,
        circulating_supply: coin.circulating_supply,
        total_supply: coin.total_supply,
        max_supply: coin.max_supply,
        ath: coin.ath,
        ath_change_percentage: coin.ath_change_percentage,
        ath_date: coin.ath_date,
        atl: coin.atl,
        atl_change_percentage: coin.atl_change_percentage,
        atl_date: coin.atl_date,
        last_updated: coin.last_updated
      }));

      return transformedData;
    } catch (error) {
      console.error("API fetch error:", error);
      return []; // Return empty array as fallback
    }
  }

  async getTokenInfo(tokenId: string): Promise<TokenInfo> {
    try {
      // Use CoinGecko API directly for token info
      const response = await fetch(
        `${this.baseUrl}/coins/${encodeURIComponent(tokenId)}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
        {
          headers: {
            accept: "application/json",
            ...(API_KEY && { "x-cg-demo-api-key": API_KEY }),
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Token '${tokenId}' not found`);
        }
        throw new Error(`API error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform CoinGecko data to match our TokenInfo interface
      return {
        id: data.id,
        symbol: data.symbol,
        name: data.name,
        image: data.image?.large || data.image?.small || '',
        current_price: data.market_data?.current_price?.usd || 0,
        market_cap: data.market_data?.market_cap?.usd || 0,
        total_volume: data.market_data?.total_volume?.usd || 0,
        price_change_percentage_24h: data.market_data?.price_change_percentage_24h || 0,
        description: data.description?.en || '',
        market_cap_rank: data.market_cap_rank || 0
      };
    } catch (error) {
      console.error(`Token info fetch error for ${tokenId}:`, error);
      throw error;
    }
  }

  async getWordPressPost<T = any[]>(): Promise<T> {
    try {
      const postsResponse = await fetch(
        "https://blog.pumpparade.com/wp-json/wp/v2/posts?_embed&per_page=100"
      );
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
        const tagsUrl = `https://blog.pumpparade.com/wp-json/wp/v2/tags?include=${allTagIds.join(
          ","
        )}`;
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
        tagNames: post.tags.map((tagId: number) => tagMap[tagId] || ""),
      }));

      return postsWithTagNames as T;
    } catch (error) {
      console.error("WordPress fetch error:", error);
      throw error;
    }
  }

  async getFearGreedIndex(): Promise<{
    value: number;
    classification: string;
  }> {
    try {
      const response = await fetch("https://api.alternative.me/fng/");
      if (!response.ok) {
        throw new Error(`Fear & Greed API error: ${response.status}`);
      }

      const data = await response.json();
      const latestData = data.data[0];

      return {
        value: parseInt(latestData.value),
        classification: latestData.value_classification,
      };
    } catch (error) {
      console.error("Fear & Greed Index fetch error:", error);
      return { value: 52, classification: "Neutral" }; // Fallback
    }
  }

  async getDefiTVL(): Promise<{ tvl: number; change24h: number }> {
    try {
      const response = await fetch("https://api.llama.fi/v2/chains");
      if (!response.ok) {
        throw new Error(`DeFi TVL API error: ${response.status}`);
      }

      const data = await response.json();
      const totalTvl = data.reduce(
        (sum: number, chain: any) => sum + (chain.tvl || 0),
        0
      );

      return {
        tvl: totalTvl,
        change24h: 3.2, // API doesn't provide 24h change, using placeholder
      };
    } catch (error) {
      console.error("DeFi TVL fetch error:", error);
      return { tvl: 127800000000, change24h: 3.2 }; // Fallback
    }
  }

  async getMarketVolatility(): Promise<{
    volatility: number;
    trend: "low" | "normal" | "high";
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/global`, {
        headers: {
          accept: "application/json",
          key: API_KEY || "",
        },
      });

      if (!response.ok) {
        throw new Error(`CoinGecko Global API error: ${response.status}`);
      }

      const data = await response.json();

      // Calculate volatility based on market cap change and total volume
      const marketCapChange = Math.abs(
        data.data.market_cap_change_percentage_24h_usd || 0
      );
      const marketCapToVolumeRatio =
        data.data.total_volume.usd / data.data.total_market_cap.usd;

      // Create volatility index (0-100) based on market cap change and volume ratio
      const volatility = Math.min(
        100,
        Math.round(marketCapChange * 3 + marketCapToVolumeRatio * 300)
      );

      let trend: "low" | "normal" | "high" = "normal";
      if (volatility < 25) trend = "low";
      else if (volatility > 60) trend = "high";

      return { volatility, trend };
    } catch (error) {
      console.error("Market Volatility fetch error:", error);
      return { volatility: 32, trend: "normal" }; // Fallback
    }
  }
}

export const apiService = new ApiService();
