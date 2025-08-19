import { CryptoToken } from "@/types/crypto";
import { TokenInfo } from "@/hooks/useTokenInfo";

const API_KEY = import.meta.env.VITE_TOKEN_KEY;
const SERVER_URL = "https://server.pumpparade.com";
class ApiService {
  private baseUrl = "https://api.coingecko.com/api/v3";

  async getAllCryptos(): Promise<CryptoToken[]> {
    try {
      // Try the backend first
      const response = await fetch(`${SERVER_URL}/api/cryptos`, {
        headers: {
          accept: "application/json",
        },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`Backend API error! status: ${response.status}`);
      }

      const data = await response.json();

      // Transform data to match CryptoToken interface
      const transformedData = data.map((coin: any) => ({
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        image: coin.image,
        current_price: coin.current_price,
        market_cap: coin.market_cap,
        total_volume: coin.total_volume,
        price_change_24h: coin.price_change_24h,
        price_change_percentage_24h: coin.price_change_percentage_24h,
        price_change_percentage_7d_in_currency: coin.price_change_percentage_7d_in_currency,
        price_change_percentage_30d_in_currency: coin.price_change_percentage_30d_in_currency,
        category: "Unknown", // Will be assigned later by category mapping
        value: coin.id,
        label: coin.name,
        price: coin.current_price,
        change24h: coin.price_change_percentage_24h,
        volume24h: coin.total_volume,
        marketCap: coin.market_cap,
        rank: coin.market_cap_rank,
        ath: coin.ath,
        atl: coin.atl,
      }));

      return transformedData;
    } catch (error) {
      console.error("Backend API fetch error:", error);
      
      // Fallback to CoinGecko API directly
      try {
        console.log("Falling back to CoinGecko API directly...");
        const fallbackResponse = await fetch(
          `${this.baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=24h,7d,30d`,
          {
            headers: {
              accept: "application/json",
              ...(API_KEY && { "x-cg-demo-api-key": API_KEY }),
            },
            // Add timeout to prevent hanging
            signal: AbortSignal.timeout(10000), // 10 second timeout
          }
        );

        if (!fallbackResponse.ok) {
          throw new Error(`CoinGecko API error! status: ${fallbackResponse.status}`);
        }

        const fallbackData = await fallbackResponse.json();
        console.log("Successfully fetched data from CoinGecko fallback");
        
        // Transform fallback data to match CryptoToken interface
        const transformedFallbackData = fallbackData.map((coin: any) => ({
          id: coin.id,
          symbol: coin.symbol,
          name: coin.name,
          image: coin.image,
          current_price: coin.current_price,
          market_cap: coin.market_cap,
          total_volume: coin.total_volume,
          price_change_24h: coin.price_change_24h,
          price_change_percentage_24h: coin.price_change_percentage_24h,
          price_change_percentage_7d_in_currency: coin.price_change_percentage_7d_in_currency,
          price_change_percentage_30d_in_currency: coin.price_change_percentage_30d_in_currency,
          category: "Unknown", // Will be assigned later by category mapping
          value: coin.id,
          label: coin.name,
          price: coin.current_price,
          change24h: coin.price_change_percentage_24h,
          volume24h: coin.total_volume,
          marketCap: coin.market_cap,
          rank: coin.market_cap_rank,
          ath: coin.ath,
          atl: coin.atl,
        }));
        
        return transformedFallbackData;
      } catch (fallbackError) {
        console.error("CoinGecko fallback also failed:", fallbackError);
        // Return mock data instead of empty array to prevent loading issues
        return this.getMockCryptoData();
      }
    }
  }

  async getTokenInfo(tokenId: string): Promise<TokenInfo> {
    try {
      const response = await fetch(
        `${SERVER_URL}/api/token-info/${encodeURIComponent(tokenId)}`,
        {
          headers: {
            accept: "application/json",
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
      return data;
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

  private getMockCryptoData(): CryptoToken[] {
    return [
      {
        id: "bitcoin",
        symbol: "btc",
        name: "Bitcoin",
        image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
        current_price: 67890,
        market_cap: 1340000000000,
        marketCap: 1340000000000,
        total_volume: 25000000000,
        price_change_24h: 1200,
        price_change_percentage_24h: 1.8,
        price_change_percentage_7d_in_currency: 5.2,
        price_change_percentage_30d_in_currency: 12.5,
        category: "Layer 1",
        value: "bitcoin",
        label: "Bitcoin",
        price: 67890,
        change24h: 1.8,
        volume24h: 25000000000,
        rank: 1,
        ath: 73750,
        atl: 67.81,
      },
      {
        id: "ethereum",
        symbol: "eth",
        name: "Ethereum",
        image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
        current_price: 3450,
        market_cap: 415000000000,
        marketCap: 415000000000,
        total_volume: 18000000000,
        price_change_24h: 85,
        price_change_percentage_24h: 2.5,
        price_change_percentage_7d_in_currency: 8.1,
        price_change_percentage_30d_in_currency: 15.3,
        category: "Layer 1",
        value: "ethereum",
        label: "Ethereum",
        price: 3450,
        change24h: 2.5,
        volume24h: 18000000000,
        rank: 2,
        ath: 4878,
        atl: 0.432979,
      }
    ];
  }
}

export const apiService = new ApiService();
