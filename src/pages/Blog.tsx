
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
import { ArrowLeft, TrendingUp, Clock, Star } from "lucide-react";

const Blog = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
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
          const tagname = post.tagNames?.filter((t: string) => t)?.join(", ") || "";

          return formatArticleForDisplay({
            id: post.id,
            title,
            excerpt,
            author,
            date,
            category: "Blog",
            readTime: "4 min read",
            image,
            url: post.link,
            content,
            tagname,
          });
        });

        setArticles(formattedArticles);
        
        // Extract unique categories from articles
        const uniqueCategories = [...new Set(formattedArticles.map(article => article.category))];
        setCategories(uniqueCategories.map(cat => ({ name: cat, articles: formattedArticles.filter(a => a.category === cat) })));
      }
    } catch (error) {
      console.error("Failed to fetch blog data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demonstration - in real implementation, these would come from analytics
  const featuredArticle = articles[0] || null;
  const trendingArticles = articles.slice(1, 7);
  const latestArticles = articles.slice(0, 12);

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

        {/* Trending Articles */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-6 w-6 text-red-400" />
            <h2 className="text-2xl font-bold text-white">Trending This Week</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>

        {/* Latest Articles */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="h-6 w-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Latest Articles</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {latestArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>

        {/* Category Sections */}
        <div className="space-y-12">
          {categories.map((category) => (
            <CategorySection
              key={category.name}
              categoryName={category.name}
              articles={category.articles}
            />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
