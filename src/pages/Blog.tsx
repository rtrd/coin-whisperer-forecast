
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IndexHeader } from "@/components/IndexHeader";
import Footer from "@/components/Footer";
import { ArticleCard } from "@/components/ArticleCard";
import { FeaturedArticle } from "@/components/FeaturedArticle";
import { CategorySection } from "@/components/CategorySection";
import { getWordPressPost } from "../../utils/api";
import { formatArticleForDisplay } from "@/utils/articleUtils";
import { ArrowLeft, TrendingUp, Clock, Star, Hash } from "lucide-react";

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
      
      if (Array.isArray(articleData)) {
        const formattedArticles = articleData.map((post) => {
          const title = post.title?.rendered || "No Title";
          const excerpt = post.excerpt?.rendered?.replace(/<[^>]+>/g, "") || "";
          const date = new Date(post.date).toISOString().split("T")[0];
          const author = post._embedded?.author?.[0]?.name || "Unknown";
          const image = post.jetpack_featured_media_url || 
                      post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || 
                      "https://via.placeholder.com/800x400";
          const content = post.content?.rendered || "";
          
          // Extract category from WordPress categories with proper fallback
          const wpCategories = post._embedded?.["wp:term"]?.[0] || [];
          let categoryName = "General";
          
          if (wpCategories.length > 0) {
            const category = wpCategories.find((cat: any) => cat.taxonomy === "category" && cat.name !== "Uncategorized");
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
        formattedArticles.forEach(article => {
          const category = article.category;
          if (category && category !== "General" && category !== "Uncategorized") {
            if (!categoryGroups[category]) {
              categoryGroups[category] = [];
            }
            categoryGroups[category].push(article);
          }
        });

        // If no specific categories found, use placeholder categories with actual articles
        if (Object.keys(categoryGroups).length === 0) {
          const placeholderCategories = ["Trading", "DeFi", "Bitcoin", "Ethereum", "Altcoins", "NFTs"];
          placeholderCategories.forEach((category, index) => {
            const categoryArticles = formattedArticles.slice(index * 3, (index + 1) * 3);
            if (categoryArticles.length > 0) {
              categoryGroups[category] = categoryArticles.map(article => ({
                ...article,
                category: category
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

  // Mock data for demonstration - in real implementation, these would come from analytics
  const featuredArticle = articles[0] || null;
  const trendingArticles = articles.slice(1, 6); // Changed to get 5 items
  const latestArticles = articles.slice(0, 8);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading blog...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-4 md:py-8">
        <IndexHeader
          selectedCrypto="bitcoin"
          cryptoOptions={cryptoOptions}
          currentPrice={45000}
          priceChange={2.5}
        />
      </div>

      <div className="container mx-auto px-4 pb-8">
        {/* Back Button and Page Title */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button
                variant="outline"
                className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-white">Crypto Blog</h1>
          </div>
        </div>

        {/* Featured Article */}
        {featuredArticle && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Star className="h-6 w-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white">Featured Article</h2>
            </div>
            <FeaturedArticle article={featuredArticle} />
          </div>
        )}

        {/* Trending Articles - Ranking Structure */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-6 w-6 text-red-400" />
            <h2 className="text-2xl font-bold text-white">Trending This Week</h2>
          </div>
          
          {trendingArticles.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              {/* #1 Trending - 30% bigger, takes more space */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <div className="absolute -top-2 -left-2 z-10">
                    <Badge className="bg-yellow-600 text-black font-bold text-sm px-3 py-1">
                      #1
                    </Badge>
                  </div>
                  <ArticleCard 
                    key={trendingArticles[0].id} 
                    article={trendingArticles[0]} 
                    variant="blog"
                    highlighted={true}
                  />
                </div>
              </div>
              
              {/* #2-#5 Trending - smaller cards in sidebar */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                {trendingArticles.slice(1, 5).map((article, index) => (
                  <div key={article.id} className="relative">
                    <div className="absolute -top-2 -left-2 z-10">
                      <Badge className="bg-gray-600 text-white font-bold text-sm px-2 py-1">
                        #{index + 2}
                      </Badge>
                    </div>
                    <ArticleCard 
                      article={article} 
                      variant="blog" 
                      compact={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Latest Articles */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="h-6 w-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Latest Articles</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {latestArticles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="blog" />
            ))}
          </div>
        </div>

        {/* Category Sections - Unified Container */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2 text-2xl">
              <Hash className="h-6 w-6 text-blue-400" />
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(categories).map(([categoryName, categoryArticles]) => (
                <div key={categoryName} className="space-y-3">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Hash className="h-4 w-4 text-blue-400" />
                    {categoryName}
                    <span className="text-gray-400 text-sm font-normal">
                      ({categoryArticles.length})
                    </span>
                  </h3>
                  <div className="space-y-3">
                    {categoryArticles.slice(0, 4).map((article) => (
                      <ArticleCard 
                        key={article.id} 
                        article={article} 
                        variant="blog"
                        horizontal={true}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
