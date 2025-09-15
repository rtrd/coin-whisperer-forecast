// Optimized blog service for progressive loading while maintaining full functionality
import { optimizedWordPressService } from './optimizedWordPressService';
import { apiService } from './apiService';
import { decodeHtmlEntities } from '@/utils/htmlUtils';
import { formatArticleForDisplay } from '@/utils/articleUtils';

interface BlogLoadState {
  articles: any[];
  totalCount: number;
  hasMore: boolean;
  loading: boolean;
  categories: { [key: string]: any[] };
}

class OptimizedBlogService {
  private cache = new Map<string, any>();
  private readonly cacheTime = 5 * 60 * 1000; // 5 minutes

  // Quick initial load with 20 posts for immediate UI response
  async getInitialBlogData(): Promise<BlogLoadState> {
    const cacheKey = 'initial_blog_data';
    const cached = this.getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      // First, try to get optimized posts for quick display
      const optimizedPosts = await optimizedWordPressService.getOptimizedPosts(20);
      
      // Transform for consistency with full blog format
      const articles = optimizedPosts.map((post, index) => 
        formatArticleForDisplay({
          id: post.id,
          title: post.title,
          excerpt: post.excerpt,
          author: post.author,
          date: new Date(post.date).toISOString().split("T")[0],
          category: post.category,
          allCategories: [post.category],
          readTime: "4 min read",
          image: post.image,
          url: post.url,
          content: "",
          tagname: "",
          tagNames: post.tags || [],
        })
      );

      // Generate basic categories from available articles
      const categoryGroups = this.generateCategoryGroups(articles);

      const result: BlogLoadState = {
        articles,
        totalCount: 100, // We know there are more
        hasMore: true,
        loading: false,
        categories: categoryGroups
      };

      this.setCachedData(cacheKey, result);
      return result;

    } catch (error) {
      console.error('Failed to load initial blog data:', error);
      return {
        articles: [],
        totalCount: 0,
        hasMore: false,
        loading: false,
        categories: {}
      };
    }
  }

  // Background load of complete data with full functionality
  async getFullBlogData(): Promise<BlogLoadState> {
    const cacheKey = 'full_blog_data';
    const cached = this.getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const articleData = await apiService.getWordPressPost();
      
      if (!Array.isArray(articleData)) {
        throw new Error('Invalid article data format');
      }

      const formattedArticles = articleData.map((post, index) => {
        const title = decodeHtmlEntities(post.title?.rendered || "No Title");
        const excerpt = decodeHtmlEntities(post.excerpt?.rendered?.replace(/<[^>]+>/g, "") || "");
        const date = new Date(post.date).toISOString().split("T")[0];
        const author = post._embedded?.author?.[0]?.name || "Unknown";
        const image =
          post.jetpack_featured_media_url ||
          post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
          "https://via.placeholder.com/800x400";
        const content = decodeHtmlEntities(post.content?.rendered || "");

        // Extract all categories from WordPress categories
        const wpCategories = post._embedded?.["wp:term"]?.[0] || [];
        let categoryName = "General";
        let allCategories: string[] = [];

        if (wpCategories.length > 0) {
          const categories = wpCategories.filter(
            (cat: any) =>
              cat.taxonomy === "category" && cat.name !== "Uncategorized"
          );
          
          if (categories.length > 0) {
            categoryName = categories[0].name;
            allCategories = categories.map((cat: any) => cat.name);
          }
        }

        return formatArticleForDisplay({
          id: post.id,
          title,
          excerpt,
          author,
          date,
          category: categoryName,
          allCategories: allCategories,
          readTime: "4 min read",
          image,
          url: post.link,
          content,
          tagname: post.tagNames?.filter((t: string) => t)?.join(", ") || "",
          tagNames: post.tagNames?.filter((t: string) => t && t.trim()) || [],
        });
      });

      // Generate comprehensive category groups
      const categoryGroups = this.generateCategoryGroups(formattedArticles);

      const result: BlogLoadState = {
        articles: formattedArticles,
        totalCount: formattedArticles.length,
        hasMore: false,
        loading: false,
        categories: categoryGroups
      };

      this.setCachedData(cacheKey, result);
      return result;

    } catch (error) {
      console.error('Failed to load full blog data:', error);
      // Return empty state if full load fails
      return {
        articles: [],
        totalCount: 0,
        hasMore: false,
        loading: false,
        categories: {}
      };
    }
  }

  private generateCategoryGroups(articles: any[]): { [key: string]: any[] } {
    const categoryGroups: { [key: string]: any[] } = {};
    
    articles.forEach((article) => {
      const categories = article.allCategories || [article.category];
      
      categories.forEach((category: string) => {
        if (
          category &&
          category !== "General" &&
          category !== "Uncategorized" &&
          category !== "Featured"
        ) {
          if (!categoryGroups[category]) {
            categoryGroups[category] = [];
          }
          categoryGroups[category].push(article);
        }
      });
    });

    // If no specific categories found, use placeholder categories
    if (Object.keys(categoryGroups).length === 0) {
      const placeholderCategories = [
        "Trading",
        "DeFi", 
        "Bitcoin",
        "Ethereum",
        "Altcoins",
        "NFTs",
      ];
      
      placeholderCategories.forEach((category, index) => {
        const categoryArticles = articles.slice(index * 3, (index + 1) * 3);
        if (categoryArticles.length > 0) {
          categoryGroups[category] = categoryArticles.map((article) => ({
            ...article,
            category: category,
          }));
        }
      });
    }

    return categoryGroups;
  }

  private getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTime) {
      return cached.data;
    }
    return null;
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const optimizedBlogService = new OptimizedBlogService();