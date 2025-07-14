import React, { useState, useEffect } from "react";
import { BlogLayout } from "@/components/blog/BlogLayout";
import { BlogHeader } from "@/components/blog/BlogHeader";
import { BlogFeaturedSection } from "@/components/blog/BlogFeaturedSection";
import { BlogTrendingSection } from "@/components/blog/BlogTrendingSection";
import { BlogLatestSection } from "@/components/blog/BlogLatestSection";
import { BlogCategoriesSection } from "@/components/blog/BlogCategoriesSection";
import { getWordPressPost } from "../../utils/api";
import { formatArticleForDisplay, getFeaturedArticle } from "@/utils/articleUtils";

const Blog = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<{ [key: string]: any[] }>({});
  const [loading, setLoading] = useState(true);

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
    fetchBlogData();
  }, []);

  const fetchBlogData = async () => {
    try {
      const articleData = await getWordPressPost();
      console.log("🔍 RAW WordPress data:", articleData);
      
      if (Array.isArray(articleData)) {
        console.log("🔍 Processing", articleData.length, "WordPress posts");
        
        const formattedArticles = articleData.map((post, index) => {
          const title = post.title?.rendered || "No Title";
          const excerpt = post.excerpt?.rendered?.replace(/<[^>]+>/g, "") || "";
          const date = new Date(post.date).toISOString().split("T")[0];
          const author = post._embedded?.author?.[0]?.name || "Unknown";
          const image =
            post.jetpack_featured_media_url ||
            post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
            "https://via.placeholder.com/800x400";
          const content = post.content?.rendered || "";

          // Debug raw WordPress tag data
          console.log(`🔍 Post ${index + 1}: "${title}"`);
          console.log("  - Raw tags array:", post.tags);
          console.log("  - Raw tagNames array:", post.tagNames);
          console.log("  - Filtered tagNames:", post.tagNames?.filter((t: string) => t && t.trim()));

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
              // Use first category as primary category
              categoryName = categories[0].name;
              // Store all categories for later use
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
            allCategories: allCategories, // Store all categories
            readTime: "4 min read",
            image,
            url: post.link,
            content,
            tagname: post.tagNames?.filter((t: string) => t)?.join(", ") || "",
            tagNames: post.tagNames?.filter((t: string) => t && t.trim()) || [], // Pass original array
          });
        });

        setArticles(formattedArticles);

        // Group articles by all their categories, excluding "General", "Uncategorized", and "Featured"
        const categoryGroups: { [key: string]: any[] } = {};
        formattedArticles.forEach((article) => {
          console.log(article);
          // Use all categories if available, otherwise use primary category
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

        // If no specific categories found, use placeholder categories with actual articles
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
            const categoryArticles = formattedArticles.slice(
              index * 3,
              (index + 1) * 3
            );
            if (categoryArticles.length > 0) {
              categoryGroups[category] = categoryArticles.map((article) => ({
                ...article,
                category: category,
              }));
            }
          });
        }

        setCategories(categoryGroups);
      }
    } catch (error) {
      console.error("Failed to fetch blog data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Select featured article based on "Featured" tag or fallback to first article
  const featuredArticle = getFeaturedArticle(articles);
  const trendingArticles = articles.slice(0, 5); // Changed to get 5 items
  const latestArticles = articles.slice(0, 8);
  console.log("Article:", articles.length);
  console.log("Trending Articles:", trendingArticles.length);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading blog...</div>
      </div>
    );
  }

  return (
    <BlogLayout cryptoOptions={cryptoOptions}>
      <BlogHeader />
      <BlogFeaturedSection featuredArticle={featuredArticle} />
      <BlogTrendingSection trendingArticles={trendingArticles} />
      <BlogLatestSection latestArticles={latestArticles} />
      <BlogCategoriesSection categories={categories} />
    </BlogLayout>
  );
};

export default Blog;
