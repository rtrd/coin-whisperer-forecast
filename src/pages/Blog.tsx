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
      console.log("Fetched blog data:", articleData);
      if (Array.isArray(articleData)) {
        const formattedArticles = articleData.map((post) => {
          const title = post.title?.rendered || "No Title";
          const excerpt = post.excerpt?.rendered?.replace(/<[^>]+>/g, "") || "";
          const date = new Date(post.date).toISOString().split("T")[0];
          const author = post._embedded?.author?.[0]?.name || "Unknown";
          const image =
            post.jetpack_featured_media_url ||
            post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
            "https://via.placeholder.com/800x400";
          const content = post.content?.rendered || "";

          // Extract category from WordPress categories with proper fallback
          const wpCategories = post._embedded?.["wp:term"]?.[0] || [];
          //console.log(JSON.stringify(post._embedded?.["wp:term"], null, 2));
          let categoryName = "General";

          if (wpCategories.length > 0) {
            const category = wpCategories.find(
              (cat: any) =>
                cat.taxonomy === "category" && cat.name !== "Uncategorized"
            );
            if (category) {
              categoryName = category.name;
            }
          }

          return formatArticleForDisplay({
            id: post.id,
            title,
            excerpt,
            author,
            date,
            category: categoryName,
            readTime: "4 min read",
            image,
            url: post.link,
            content,
            tagname: post.tagNames?.filter((t: string) => t)?.join(", ") || "",
          });
        });

        setArticles(formattedArticles);

        // Group articles by category, excluding "General" and empty categories
        const categoryGroups: { [key: string]: any[] } = {};
        formattedArticles.forEach((article) => {
          console.log(article);
          const category = article.category;
          if (
            category &&
            category !== "General" &&
            category !== "Uncategorized"
          ) {
            if (!categoryGroups[category]) {
              categoryGroups[category] = [];
            }
            categoryGroups[category].push(article);
          }
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
