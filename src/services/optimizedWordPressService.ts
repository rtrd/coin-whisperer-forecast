// Optimized WordPress service with caching, reduced API calls, and performance improvements
import { calculateReadingTime } from '@/utils/readingTime';

interface CachedData {
  data: any;
  timestamp: number;
  ttl: number;
}

interface WordPressPost {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  content?: { rendered: string };
  date: string;
  featured_media: number;
  link: string;
  tags: number[];
  _links: {
    author: Array<{ href: string }>;
    'wp:featuredmedia'?: Array<{ href: string }>;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string }>;
  };
}

class OptimizedWordPressService {
  private cache = new Map<string, CachedData>();
  private pendingRequests = new Map<string, Promise<any>>();
  private readonly baseUrl = 'https://blog.pumpparade.com/wp-json/wp/v2';
  private readonly timeout = 5000; // 5 second timeout

  private isDataFresh(cached: CachedData): boolean {
    return Date.now() - cached.timestamp < cached.ttl;
  }

  public getCachedData<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && this.isDataFresh(cached)) {
      return cached.data;
    }
    return null;
  }

  private setCachedData(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  private async fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          ...options.headers
        }
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // Optimized posts fetch - only get what we need
  async getOptimizedPosts(limit: number = 12): Promise<any[]> {
    const cacheKey = `posts_${limit}`;
    
    // Check cache first
    const cached = this.getCachedData<any[]>(cacheKey);
    if (cached) {
      return cached;
    }

    // Check for pending request
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey)!;
    }

    // Create new optimized request
    const promise = this.fetchOptimizedPosts(limit);
    this.pendingRequests.set(cacheKey, promise);

    try {
      const posts = await promise;
      this.setCachedData(cacheKey, posts, 5 * 60 * 1000); // 5 minute cache
      return posts;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  private async fetchOptimizedPosts(limit: number): Promise<any[]> {
    // Optimized query: only fetch needed fields
    const fields = 'id,title,excerpt,date,featured_media,link,tags,_links.author,_links.wp:featuredmedia';
    const url = `${this.baseUrl}/posts?per_page=${limit}&_fields=${fields}&_embed=author,wp:featuredmedia`;

    try {
      const response = await this.fetchWithTimeout(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const posts: WordPressPost[] = await response.json();
      return this.transformPostsOptimized(posts);
    } catch (error) {
      console.warn('WordPress API failed, using fallback:', error);
      return this.getFallbackPosts();
    }
  }

  // Fast post transformation with minimal processing
  private transformPostsOptimized(posts: WordPressPost[]): any[] {
    return posts.map(post => ({
      id: post.id,
      title: this.fastDecodeHtml(post.title.rendered),
      excerpt: this.fastDecodeHtml(post.excerpt.rendered),
      date: post.date,
      author: 'Pump Parade Team', // Default author for speed
      image: this.extractFeaturedImage(post),
      url: post.link,
      category: 'Crypto News',
      readTime: calculateReadingTime(post.content?.rendered || post.excerpt?.rendered || ''),
      tags: [] // Will be populated by background process
    }));
  }

  // Optimized HTML decoding for better performance
  private fastDecodeHtml(html: string): string {
    if (!html) return '';
    
    // Use browser's built-in parser for speed
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

  private extractFeaturedImage(post: WordPressPost): string {
    // Use embedded media if available, otherwise placeholder
    if (post._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
      return post._embedded['wp:featuredmedia'][0].source_url;
    }
    return '/placeholder.svg';
  }

  // Tags fetched separately with longer cache
  async getOptimizedTags(): Promise<Record<number, string>> {
    const cacheKey = 'tags_mapping';
    
    const cached = this.getCachedData<Record<number, string>>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/tags?per_page=100&_fields=id,name`);
      
      if (!response.ok) {
        return {};
      }

      const tags = await response.json();
      const mapping = tags.reduce((acc: Record<number, string>, tag: any) => {
        acc[tag.id] = tag.name;
        return acc;
      }, {});

      this.setCachedData(cacheKey, mapping, 30 * 60 * 1000); // 30 minute cache
      return mapping;
    } catch (error) {
      console.warn('Failed to fetch tags:', error);
      return {};
    }
  }

  // Fallback content for when API fails
  private getFallbackPosts(): any[] {
    return [
      {
        id: 1,
        title: "Bitcoin Price Analysis - Technical Outlook",
        excerpt: "Latest analysis on Bitcoin's price movements and technical indicators...",
        date: new Date().toISOString(),
        author: "Pump Parade Team",
        image: "/placeholder.svg",
        url: "#",
        category: "Analysis",
        readTime: "3 min read",
        tags: ["Bitcoin", "Technical Analysis"]
      },
      {
        id: 2,
        title: "Ethereum 2.0 Updates and Market Impact",
        excerpt: "Recent developments in Ethereum 2.0 and their potential market effects...",
        date: new Date().toISOString(),
        author: "Pump Parade Team",
        image: "/placeholder.svg",
        url: "#",
        category: "News",
        readTime: "4 min read",
        tags: ["Ethereum", "DeFi"]
      },
      {
        id: 3,
        title: "Altcoin Season: What to Watch",
        excerpt: "Key altcoins showing strong momentum and technical setups...",
        date: new Date().toISOString(),
        author: "Pump Parade Team",
        image: "/placeholder.svg",
        url: "#",
        category: "Market",
        readTime: "2 min read",
        tags: ["Altcoins", "Trading"]
      }
    ];
  }

  // Clear cache when needed
  clearCache(): void {
    this.cache.clear();
  }

  // Get cache stats for debugging
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export const optimizedWordPressService = new OptimizedWordPressService();