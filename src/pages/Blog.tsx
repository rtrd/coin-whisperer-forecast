import { generateBlogSEO } from "@/utils/pageSeo";
import { useAdScript } from "@/hooks/useAdScript";
import React, { useState, useEffect } from "react";
import { GAMAdUnit } from "@/components/ads/GAMAdUnit";
import { BlogHeader } from "@/components/blog/BlogHeader";
import { BlogLayout } from "@/components/blog/BlogLayout";
import { EnhancedSEOHead } from "@/components/seo/EnhancedSEOHead";
import { BlogIndexSection } from "@/components/blog/BlogIndexSection";
import { optimizedBlogService } from "@/services/optimizedBlogService";
import { BlogLatestSection } from "@/components/blog/BlogLatestSection";
import { BlogFeaturedSection } from "@/components/blog/BlogFeaturedSection";
import { BlogTrendingSection } from "@/components/blog/BlogTrendingSection";
import { getFeaturedArticle, getTrendingArticles } from "@/utils/articleUtils";
import { BlogCategoriesSection } from "@/components/blog/BlogCategoriesSection";

const Blog = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<{ [key: string]: any[] }>({});
  const [loading, setLoading] = useState(true);
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);
  
  // Initialize ad script on page load
  useAdScript();

  const seoData = generateBlogSEO();

  const cryptoOptions = [
    {
      value: "bitcoin",
      label: "Bitcoin (BTC)",
      icon: "₿",
      category: "Major",
      score: 8.5,
      prediction: "+12.5%",
    },
    {
      value: "ethereum",
      label: "Ethereum (ETH)",
      icon: "Ξ",
      category: "Major",
      score: 8.2,
      prediction: "+8.3%",
    },
  ];

  useEffect(() => {
    loadBlogData();
  }, []);

  const loadBlogData = async () => {
    try {
      // Step 1: Quick initial load for immediate UI response
      const initialData = await optimizedBlogService.getInitialBlogData();
      
      setArticles(initialData.articles);
      setCategories(initialData.categories);
      setLoading(false);
      
      // Step 2: Background load of full data for complete functionality
      if (initialData.hasMore) {
        console.log("📚 Loading full blog data in background...");
        const fullData = await optimizedBlogService.getFullBlogData();
        
        if (fullData.articles.length > initialData.articles.length) {
          setArticles(fullData.articles);
          setCategories(fullData.categories);
          setIsFullyLoaded(true);
        }
      } else {
        setIsFullyLoaded(true);
      }
      
    } catch (error) {
      console.error("Failed to load blog data:", error);
      setLoading(false);
    }
  };

  // Select featured article based on "Featured" tag or fallback to first article
  const featuredArticle = getFeaturedArticle(articles);
  const trendingArticles = getTrendingArticles(articles);
  const latestArticles = articles.slice(0, 12); // Increased from 8 to 12
  
  console.log(`📊 Blog Stats: ${articles.length} articles, ${trendingArticles.length} trending, fully loaded: ${isFullyLoaded}`);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading blog...</div>
      </div>
    );
  }

  return (
    <>
      <EnhancedSEOHead seoData={seoData} />

      <BlogLayout cryptoOptions={cryptoOptions}>
        <BlogHeader />
        
        {/* Ad Banner After Header */}
        <GAMAdUnit
          adUnitId="div-gpt-ad-1752654531765-0"
          size={[728, 90]}
          className="mb-6 md:mb-8"
        />
        
        <BlogFeaturedSection featuredArticle={featuredArticle} />
        <BlogTrendingSection trendingArticles={trendingArticles} />
        <BlogLatestSection latestArticles={latestArticles} />
        <BlogCategoriesSection categories={categories} />
        
        {/* All Articles Index Section */}
        <BlogIndexSection articles={articles} />
        
        {/* Ad Banner Before Footer */}
        <GAMAdUnit
          adUnitId="div-gpt-ad-1752654531765-1"
          size={[728, 90]}
          className="mt-6 mb-6 md:mb-8"
        />
      </BlogLayout>
    </>
  );
};

export default Blog;
