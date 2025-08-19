// Enhanced API service with performance optimizations, caching, and request deduplication
import { CryptoToken } from "@/types/crypto";
import { TokenInfo } from "@/hooks/useTokenInfo";
import { performanceService } from "./performanceService";

const API_KEY = import.meta.env.VITE_TOKEN_KEY;
const SERVER_URL = "https://server.pumpparade.com/";

class OptimizedApiService {
  private baseUrl = "https://api.coingecko.com/api/v3";
  private requestQueue = new Map<string, Promise<any>>();
  
  // Enhanced crypto data fetching with caching and deduplication
  async getAllCryptos(): Promise<CryptoToken[]> {
    const cacheKey = 'all-cryptos';
    
    return performanceService.getCachedData(cacheKey, async () => {
      try {
        // Try the backend first with abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const response = await fetch(`${SERVER_URL}/api/cryptos`, {
          headers: { accept: "application/json" },
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Backend API error! status: ${response.status}`);
        }

        const data = await response.json();
        return this.transformCryptoData(data);

      } catch (error) {
        console.warn("Backend failed, trying CoinGecko fallback:", error);
        return this.getCoinGeckoFallback();
      }
    });
  }

  // Optimized token info with background prefetching
  async getTokenInfo(tokenId: string): Promise<TokenInfo> {
    const cacheKey = `token-info-${tokenId}`;
    
    return performanceService.getCachedData(cacheKey, async () => {
      const response = await fetch(`${SERVER_URL}/api/token/${tokenId}`, {
        headers: { accept: "application/json" }
      });

      if (!response.ok) {
        throw new Error(`Token API error! status: ${response.status}`);
      }

      return response.json();
    });
  }

  // Background prefetch for related tokens
  prefetchRelatedTokens(tokenIds: string[]) {
    tokenIds.forEach(id => {
      // Non-blocking prefetch
      this.getTokenInfo(id).catch(() => {
        // Silently fail for prefetch requests
      });
    });
  }

  // Batch API requests
  async batchRequest<T>(requests: Array<() => Promise<T>>): Promise<T[]> {
    const batchSize = 5; // Limit concurrent requests
    const results: T[] = [];
    
    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize);
      const batchResults = await Promise.allSettled(
        batch.map(request => request())
      );
      
      batchResults.forEach(result => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        }
      });
    }
    
    return results;
  }

  // WordPress posts with aggressive caching
  async getWordPressPost<T = any[]>(): Promise<T> {
    const cacheKey = 'wordpress-posts';
    
    return performanceService.getCachedData(cacheKey, async () => {
      const response = await fetch(
        'https://blog.pumpparade.com/wp-json/wp/v2/posts?per_page=10&_embed&_fields=id,title,excerpt,link,date,tags,_embedded'
      );

      if (!response.ok) {
        throw new Error(`WordPress API error! status: ${response.status}`);
      }

      const posts = await response.json();
      
      // Transform and optimize data
      return posts.map((post: any) => ({
        ...post,
        tagNames: post._embedded?.['wp:term']?.[1]?.map((tag: any) => tag.name) || []
      }));
    });
  }

  // Market indicators with combined requests
  async getMarketIndicators() {
    const cacheKey = 'market-indicators';
    
    return performanceService.getCachedData(cacheKey, async () => {
      const [fearGreed, defiTvl, volatility] = await Promise.allSettled([
        this.getFearGreedIndex(),
        this.getDefiTVL(),
        this.getMarketVolatility()
      ]);

      return {
        fearGreed: fearGreed.status === 'fulfilled' ? fearGreed.value : null,
        defiTvl: defiTvl.status === 'fulfilled' ? defiTvl.value : null,
        volatility: volatility.status === 'fulfilled' ? volatility.value : null
      };
    });
  }

  // Private helper methods
  private transformCryptoData(data: any[]): CryptoToken[] {
    return data.map((coin, index) => ({
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
      price_change_percentage_7d_in_currency: coin.price_change_percentage_7d_in_currency,
      price_change_percentage_30d_in_currency: coin.price_change_percentage_30d_in_currency,
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
      roi: coin.roi,
      last_updated: coin.last_updated,
      sparkline_in_7d: coin.sparkline_in_7d,
      price_change_percentage_1h_in_currency: coin.price_change_percentage_1h_in_currency,
      price_change_percentage_24h_in_currency: coin.price_change_percentage_24h_in_currency,
      // Additional required fields
      value: coin.id || coin.symbol?.toLowerCase() || `token-${index}`,
      label: coin.name || coin.symbol,
      price: coin.current_price || 0,
      change24h: coin.price_change_percentage_24h || 0,
      volume24h: coin.total_volume || 0,
      marketCap: coin.market_cap || 0,
      category: 'Cryptocurrency',
      predictionPercentage: null, // Will be populated by user request
      aiScore: null // Will be populated by user request
    }));
  }

  private async getCoinGeckoFallback(): Promise<CryptoToken[]> {
    const url = `${this.baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d%2C30d&locale=en&precision=full`;
    
    const response = await fetch(url, {
      headers: { accept: "application/json" }
    });

    if (!response.ok) {
      throw new Error(`CoinGecko API error! status: ${response.status}`);
    }

    const data = await response.json();
    return this.transformCryptoData(data);
  }

  private async getFearGreedIndex(): Promise<{ value: number; classification: string; }> {
    const response = await fetch("https://api.alternative.me/fng/?limit=1");
    if (!response.ok) throw new Error("Fear & Greed API error");
    
    const data = await response.json();
    return {
      value: parseInt(data.data[0].value),
      classification: data.data[0].value_classification
    };
  }

  private async getDefiTVL(): Promise<{ tvl: number; change24h: number; }> {
    const response = await fetch("https://api.llama.fi/v2/chains");
    if (!response.ok) throw new Error("DeFi Llama API error");
    
    const chains = await response.json();
    const totalTvl = chains.reduce((sum: number, chain: any) => sum + (chain.tvl || 0), 0);
    const totalChange = chains.reduce((sum: number, chain: any) => sum + (chain.change_24h || 0), 0);
    
    return {
      tvl: totalTvl,
      change24h: totalChange / chains.length
    };
  }

  private async getMarketVolatility(): Promise<{ volatility: number; trend: "low" | "normal" | "high"; }> {
    const response = await fetch(`${this.baseUrl}/global`);
    if (!response.ok) throw new Error("CoinGecko Global API error");
    
    const data = await response.json();
    const marketCapChange = Math.abs(data.data.market_cap_change_percentage_24h_usd || 0);
    const volumeRatio = (data.data.total_volume?.usd || 0) / (data.data.total_market_cap?.usd || 1);
    
    const volatility = marketCapChange + (volumeRatio * 100);
    let trend: "low" | "normal" | "high" = "normal";
    
    if (volatility < 3) trend = "low";
    else if (volatility > 8) trend = "high";
    
    return { volatility, trend };
  }

  // Clear all caches
  clearAllCaches() {
    performanceService.clearCache();
  }
}

export const optimizedApiService = new OptimizedApiService();