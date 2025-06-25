import React, { useEffect, useState } from "react";
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
import { getAllCryptos } from "../../utils/api";
import { getWordPressPost } from "../../utils/api";

const CACHE_KEY = "topLoosersandGainnersCache";
const CACHE_DURATION = 10 * 60 * 1000;

const Article = () => {
  debugger;
  const { articleId } = useParams<{ articleId: string }>();
  const [articlesData, setArticlesData] = useState<any[]>([]);
  const location = useLocation();
  const [topGainnersandLoosers, setallTopGainnersandLoosers] = useState<any[]>(
    []
  );

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

  useEffect(() => {
    fetchAndCacheTopGainnersandLoosers();
    getAllarticles();
  }, []);

  const fetchAndCacheTopGainnersandLoosers = async () => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setallTopGainnersandLoosers(data);
          return;
        }
      } catch (err) {
        // If cache is corrupted, ignore and fetch fresh
      }
    }
    // Fetch and cache if not found or expired
    try {
      const data = await getAllCryptos();
      setallTopGainnersandLoosers(data);
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ data, timestamp: Date.now() })
      );
    } catch (err) {
      // // Handle fetch error if needed
      // setallArticlesData([]);
    }
  };

  const getAllarticles = async () => {
    const AllarticleData = await getWordPressPost();
    setArticlesData(AllarticleData as any[]);
  };

  const article = articles.find((a) => a.id === Number(articleId));

  //related articles with tags for filtering
  const transformArticles = (articles: any[]): any[] => {
    return articles.map((a) => ({
      id: a.id,
      title: a.title?.rendered || "Untitled",
      author: a.author || "Unknown",
      date: a.date || "",
      category: a.category || "Blog",
      readTime: a.readTime || "3 min read",
      image: a.image || a.jetpack_featured_media_url || "",
      content: a.content?.rendered || "",
      tags:
        a.tags?.filter(
          (t: string) => typeof t === "string" && t.trim() !== ""
        ) || [],
    }));
  };

  if (!article) {
    return <ArticleNotFound />;
  }
  const relatedArticles = getRelatedArticles(article, articlesData);
  const transformedArticles = transformArticles(relatedArticles);

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
            <RelatedArticles articles={transformedArticles} />
          </div>

          {/* Sticky Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-8 space-y-8">
              <ArticleIndex content={article.content} />
              <AdBanner width={300} height={600} position="vertical" />
              <MarketWinnersWidget
                topGainnersandLoosers={topGainnersandLoosers}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Article;
