import { CryptoToken } from "@/types/crypto";
import { TokenInfo } from "@/hooks/useTokenInfo";
import {
  Article,
  CategorySectionData,
  WordPressPostsPage,
  WordPressPostsPageParams,
  WordPressTaxonomyTerm,
} from "@/types/blog";
import { decodeHtmlEntities } from "@/utils/htmlUtils";
import { calculateReadingTime } from "@/utils/readingTime";
import { createTaxonomyMap, hydrateArticles } from "@/utils/wordPressArticles";

const API_KEY = import.meta.env.VITE_TOKEN_KEY;
const SERVER_URL = "https://server.pumpparade.com";

interface WordPressListPostResponse {
  id: number;
  date: string;
  link: string;
  title?: { rendered?: string };
  excerpt?: { rendered?: string };
  jetpack_featured_media_url?: string;
  categories?: number[];
  tags?: number[];
}

interface WordPressDetailPostResponse extends WordPressListPostResponse {
  content?: { rendered?: string };
  _embedded?: {
    author?: Array<{ name?: string }>;
    "wp:featuredmedia"?: Array<{ source_url?: string }>;
  };
}

class ApiService {
  private baseUrl = "https://api.coingecko.com/api/v3";
  private wordPressBaseUrl = "https://blog.pumpparade.com/wp-json/wp/v2";

  async getAllCryptos(): Promise<CryptoToken[]> {
    try {
      // Try the backend first
      const response = await fetch(`${SERVER_URL}/api/cryptos`, {
        headers: {
          accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Backend API error! status: ${response.status}`);
      }

      const data = await response.json();

      // Transform data if needed
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
        last_updated: coin.last_updated,
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
          }
        );

        if (!fallbackResponse.ok) {
          throw new Error(`CoinGecko API error! status: ${fallbackResponse.status}`);
        }

        const fallbackData = await fallbackResponse.json();
        console.log("Successfully fetched data from CoinGecko fallback");
        return fallbackData;
      } catch (fallbackError) {
        console.error("CoinGecko fallback also failed:", fallbackError);
        return []; // Complete fallback
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

  async getWordPressPostsPage(
    params: WordPressPostsPageParams = {}
  ): Promise<WordPressPostsPage> {
    const page = params.page ?? 1;
    const perPage = params.perPage ?? 24;
    const searchParams = new URLSearchParams({
      page: String(page),
      per_page: String(perPage),
      _fields:
        "id,date,link,title,excerpt,jetpack_featured_media_url,categories,tags",
    });

    if (params.search) {
      searchParams.set("search", params.search);
    }
    if (params.categoryId) {
      searchParams.set("categories", String(params.categoryId));
    }
    if (params.after) {
      searchParams.set("after", params.after);
    }
    if (params.before) {
      searchParams.set("before", params.before);
    }
    if (params.orderBy) {
      searchParams.set("orderby", params.orderBy);
    }
    if (params.order) {
      searchParams.set("order", params.order);
    }
    if (params.tagId) {
      searchParams.set("tags", String(params.tagId));
    }
    if (params.excludeId) {
      searchParams.set("exclude", String(params.excludeId));
    }

    const response = await fetch(
      `${this.wordPressBaseUrl}/posts?${searchParams.toString()}`
    );

    if (!response.ok) {
      throw new Error(`WordPress API error! status: ${response.status}`);
    }

    const posts: WordPressListPostResponse[] = await response.json();
    const total = Number(response.headers.get("X-WP-Total")) || posts.length;
    const totalPages =
      Number(response.headers.get("X-WP-TotalPages")) || (posts.length > 0 ? 1 : 0);

    return {
      articles: posts.map((post) => this.transformWordPressSummary(post)),
      page,
      perPage,
      total,
      totalPages,
      hasNextPage: page < totalPages,
    };
  }

  async getWordPressPostById(id: number): Promise<Article> {
    const response = await fetch(`${this.wordPressBaseUrl}/posts/${id}?_embed=author`);

    if (!response.ok) {
      throw new Error(`WordPress API error! status: ${response.status}`);
    }

    const post: WordPressDetailPostResponse = await response.json();
    return this.transformWordPressDetail(post);
  }

  async getWordPressCategories(): Promise<WordPressTaxonomyTerm[]> {
    const response = await fetch(
      `${this.wordPressBaseUrl}/categories?per_page=100&_fields=id,name,slug,count&orderby=count&order=desc`
    );

    if (!response.ok) {
      throw new Error(`WordPress categories error! status: ${response.status}`);
    }

    return response.json();
  }

  async getWordPressTags(): Promise<WordPressTaxonomyTerm[]> {
    const response = await fetch(
      `${this.wordPressBaseUrl}/tags?per_page=100&_fields=id,name,slug,count&orderby=count&order=desc`
    );

    if (!response.ok) {
      throw new Error(`WordPress tags error! status: ${response.status}`);
    }

    return response.json();
  }

  async getWordPressCategorySections(
    limitPerCategory: number = 4,
    concurrency: number = 3
  ): Promise<CategorySectionData[]> {
    const categories = (await this.getWordPressCategories()).filter(
      (category) => !["featured", "trending"].includes(category.slug)
    );
    const categoryMap = createTaxonomyMap(categories);
    const sections: CategorySectionData[] = [];

    for (let index = 0; index < categories.length; index += concurrency) {
      const batch = categories.slice(index, index + concurrency);
      const batchSections = await Promise.all(
        batch.map(async (category) => {
          const page = await this.getWordPressPostsPage({
            page: 1,
            perPage: limitPerCategory,
            categoryId: category.id,
          });

          return {
            category,
            articles: hydrateArticles(page.articles, categoryMap),
          };
        })
      );

      sections.push(...batchSections.filter((section) => section.articles.length > 0));
    }

    return sections;
  }

  async getWordPressPost<T = any[]>(): Promise<T> {
    const firstPage = await this.getWordPressPostsPage({
      page: 1,
      perPage: 100,
    });

    return firstPage.articles as T;
  }

  private stripHtml(html: string = ""): string {
    return decodeHtmlEntities(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
  }

  private transformWordPressSummary(post: WordPressListPostResponse): Article {
    const excerpt = this.stripHtml(post.excerpt?.rendered || "");

    return {
      id: post.id,
      title: decodeHtmlEntities(post.title?.rendered || "No Title"),
      excerpt,
      author: "Pump Parade Team",
      date: post.date,
      category: "Blog",
      readTime: "4 min read",
      image: post.jetpack_featured_media_url || "/placeholder.svg",
      url: post.link,
      content: "",
      tags: [],
      tagNames: [],
      allCategories: [],
      categoryIds: post.categories || [],
      tagIds: post.tags || [],
    };
  }

  private transformWordPressDetail(post: WordPressDetailPostResponse): Article {
    const content = decodeHtmlEntities(post.content?.rendered || "");

    return {
      ...this.transformWordPressSummary(post),
      author: post._embedded?.author?.[0]?.name || "Pump Parade Team",
      excerpt: this.stripHtml(post.excerpt?.rendered || ""),
      image:
        post.jetpack_featured_media_url ||
        post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
        "/placeholder.svg",
      content,
      readTime: calculateReadingTime(content),
    };
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
