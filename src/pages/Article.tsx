import React from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { AdBanner } from "@/components/AdBanner";
import { IndexHeader } from "@/components/IndexHeader";
import { MarketWinnersWidget } from "@/components/MarketWinnersWidget";
import { ArticleIndex } from "@/components/ArticleIndex";
import Footer from "@/components/Footer";
import { ArticleHeader } from "@/components/ArticleHeader";
import { ArticleContent } from "@/components/ArticleContent";
import { RelatedArticles } from "@/components/RelatedArticles";
import { ArticleNotFound } from "@/components/ArticleNotFound";
import {
  formatArticleForDisplay,
  getRelatedArticles,
} from "@/utils/articleUtils";

const Article = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const location = useLocation();

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
    {
      id: 3,
      title: "Top 5 Altcoins to Watch This Week",
      author: "Alex Thompson",
      date: "2024-01-13",
      category: "AI Predictions",
      readTime: "3 min read",
      image:
        "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=400&h=240&fit=crop",
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
      image:
        "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=240&fit=crop",
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
      image:
        "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=240&fit=crop",
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
      image:
        "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=400&h=240&fit=crop",
      content: "",
      tags: ["nft", "trends", "market"],
    },
  ];

  if (!article) {
    return <ArticleNotFound />;
  }

  //const relatedArticles = getRelatedArticles(article, allArticles);

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
            <Card className="bg-gray-800/50 border-gray-700 overflow-hidden rounded-lg">
              <ArticleHeader article={article} />
              <ArticleContent content={article.content} tags={article.tags} />
            </Card>

            {/* Related Articles */}
            <RelatedArticles articles={allArticles} />
          </div>

          {/* Sticky Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-8 space-y-8">
              <ArticleIndex content={article.content} />
              <AdBanner width={300} height={600} position="vertical" />
              <MarketWinnersWidget />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Article;
