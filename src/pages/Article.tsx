import React from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Share2,
  BookmarkPlus,
  Tag,
} from "lucide-react";
import { AdBanner } from "@/components/AdBanner";
import { IndexHeader } from "@/components/IndexHeader";
import { MarketWinnersWidget } from "@/components/MarketWinnersWidget";
import { ArticleIndex } from "@/components/ArticleIndex";
import Footer from "@/components/Footer";

const Article = () => {
  const { articleId } = useParams<{ articleId: string }>();
  debugger;
  const location = useLocation();

  const formatArticleForDisplay = (article: any) => {
    return {
      id: article.id,
      title: article.title,
      content: article.content,
      author: article.author || "Unknown",
      date: article.date,
      category: article.category || "General",
      readTime: article.readTime || "4 min read",
      image: article.image || "https://via.placeholder.com/800x400",
      tags: article.tags || ["crypto", "analysis", "market"],
    };
  };

  const articles = Array.isArray(location.state?.article)
    ? location.state.article.map(formatArticleForDisplay)
    : location.state?.article
    ? [formatArticleForDisplay(location.state.article)]
    : [];

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

  const article = articles.find((a) => a.id === Number(articleId));

  // Mock related articles with tags for filtering
  const allArticles = [
    ...articles,
    {
      id: 3,
      title: "Top 5 Altcoins to Watch This Week",
      author: "Alex Thompson",
      date: "2024-01-13",
      category: "AI Predictions",
      readTime: "3 min read",
      image: "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=400&h=240&fit=crop",
      content: "",
      tags: ["altcoins", "crypto", "predictions"],
    },
    {
      id: 4,
      title: "DeFi Protocol Analysis: Compound vs Aave",
      author: "Maria Garcia",
      date: "2024-01-12",
      category: "DeFi Guide", 
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=240&fit=crop",
      content: "",
      tags: ["defi", "analysis", "protocols"],
    },
    {
      id: 5,
      title: "Market Sentiment Analysis for Bitcoin",
      author: "John Doe",
      date: "2024-01-11",
      category: "Market Analysis",
      readTime: "4 min read", 
      image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=240&fit=crop",
      content: "",
      tags: ["bitcoin", "analysis", "sentiment"],
    },
    {
      id: 6,
      title: "NFT Market Trends and Predictions",
      author: "Sarah Wilson",
      date: "2024-01-10",
      category: "NFT Analysis",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=400&h=240&fit=crop", 
      content: "",
      tags: ["nft", "trends", "market"],
    },
  ];

  // Filter related articles by matching tags
  const getRelatedArticles = () => {
    if (!article) return [];
    
    const currentTags = article.tags || [];
    return allArticles
      .filter((a) => a.id !== article.id)
      .filter((a) => {
        const articleTags = a.tags || [];
        return currentTags.some(tag => articleTags.includes(tag));
      })
      .slice(0, 4);
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center px-4">
        <Card className="bg-gray-800/50 border-gray-700 w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-4 text-shadow-lg">
              Article Not Found
            </h1>
            <Link to="/">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  };

  const relatedArticles = getRelatedArticles();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header like homepage */}
      <div className="container mx-auto px-4 py-4 md:py-8">
        <IndexHeader
          selectedCrypto="bitcoin"
          cryptoOptions={cryptoOptions}
          currentPrice={45000}
          priceChange={2.5}
        />
      </div>

      <div className="container mx-auto px-4 pb-8">
        {/* Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/">
            <Button
              variant="outline"
              className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Article Content with Header */}
            <Card className="bg-gray-800/50 border-gray-700 overflow-hidden">
              {/* Article Header with Background Image */}
              <div
                className="relative bg-cover bg-center h-80 article_image_custom"
                style={{ backgroundImage: `url(${article.image})` }}
              >
                <div className="absolute inset-0 bg-black/50"></div>
                <CardHeader className="relative z-10 h-full flex flex-col justify-end">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className="bg-blue-600">{article.category}</Badge>
                  </div>
                  <CardTitle
                    className="text-3xl md:text-4xl text-white mb-4"
                    style={{ textShadow: "0 0 10px rgba(0, 0, 0, 0.3)" }}
                  >
                    {article.title}
                  </CardTitle>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-gray-200 gap-4">
                    <div className="flex flex-wrap items-center gap-4 md:gap-6">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="text-sm md:text-base">
                          {article.author}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm md:text-base">
                          {new Date(article.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm md:text-base">
                          {article.readTime}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-gray-700/80 border-gray-600 text-white hover:bg-gray-600"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-gray-700/80 border-gray-600 text-white hover:bg-gray-600"
                      >
                        <BookmarkPlus className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </div>

              {/* Article Text Content */}
              <CardContent className="p-4 md:p-8">
                <div
                  className="prose prose-invert max-w-none text-gray-200 
                  prose-headings:text-shadow-lg prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-6 prose-h1:text-white
                  prose-h2:text-2xl prose-h2:font-semibold prose-h2:mb-4 prose-h2:mt-8 prose-h2:text-white
                  prose-h3:text-xl prose-h3:font-medium prose-h3:mb-3 prose-h3:mt-6 prose-h3:text-gray-100
                  prose-h4:text-lg prose-h4:font-medium prose-h4:mb-2 prose-h4:mt-4 prose-h4:text-gray-200
                  prose-p:mb-8 prose-p:leading-relaxed prose-p:text-gray-200
                  prose-ul:mb-6 prose-li:mb-2"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {/* Article Tags */}
                <div className="border-t border-gray-600 pt-6 mt-8">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="h-4 w-4 text-blue-400" />
                    <span className="text-white font-medium">Tags:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag: string, index: number) => (
                      <Badge
                        key={index}
                        variant="outline" 
                        className="bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600/50"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle
                    className="text-white"
                    style={{ textShadow: "0 0 10px rgba(0, 0, 0, 0.3)" }}
                  >
                    Related Articles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {relatedArticles.map((relatedArticle) => (
                      <Link
                        key={relatedArticle.id}
                        to={`/article/${relatedArticle.id}`}
                        state={{ article: relatedArticle }}
                        className="block group"
                      >
                        <div className="bg-gray-700/50 rounded-lg overflow-hidden hover:bg-gray-700/70 transition-colors">
                          <div
                            className="aspect-video bg-cover bg-center"
                            style={{
                              backgroundImage: `url(${relatedArticle.image})`,
                            }}
                          >
                            <div className="h-full bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                              <Badge className="bg-blue-600 text-xs">
                                {relatedArticle.category}
                              </Badge>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="text-white font-semibold mb-2 text-shadow-lg group-hover:text-blue-400 transition-colors line-clamp-2">
                              {relatedArticle.title}
                            </h3>
                            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                              <span>{relatedArticle.author}</span>
                              <span>{relatedArticle.readTime}</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {relatedArticle.tags?.slice(0, 2).map((tag: string, index: number) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs bg-gray-600/50 border-gray-500 text-gray-300"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sticky Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-8 space-y-8">
              <ArticleIndex content={article.content} />
              <MarketWinnersWidget />
              <AdBanner width={300} height={600} position="vertical" />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Article;
