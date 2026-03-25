import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import VdoBannerAd from "@/components/ads/VdoBannerAd";
import { IndexHeader } from "@/components/IndexHeader";
import { MarketWinnersWidget } from "@/components/MarketWinnersWidget";
import { ArticleIndex } from "@/components/ArticleIndex";
import Footer from "@/components/Footer";
import { ArticleHeader } from "@/components/ArticleHeader";
import { ArticleContent } from "@/components/ArticleContent";
import { RelatedArticles } from "@/components/RelatedArticles";
import { ArticleNotFound } from "@/components/ArticleNotFound";
import { getAllCryptos } from "../../utils/api";
import { CryptoToken } from "@/types/crypto";
import { generateArticleSEO } from "@/utils/pageSeo";
import { AdvancedSEOHead } from "@/components/seo/AdvancedSEOHead";
import { EnhancedBreadcrumbSchema } from "@/components/seo/EnhancedBreadcrumbSchema";
import { AdvancedPerformanceOptimizer } from "@/components/seo/AdvancedPerformanceOptimizer";
import AdUnit from "@/components/ads/VdoBannerAd";
import { Article } from "@/types/blog";
import {
  useRelatedWordPressArticles,
  useWordPressPost,
} from "@/hooks/useWordPressArticles";

const CACHE_KEY = "topGainersAndLosers";
const CACHE_DURATION = 1000 * 60 * 10;

const normalizePlaceholderArticle = (article: unknown): Article | null => {
  if (!article || typeof article !== "object" || !("id" in article)) {
    return null;
  }

  const placeholderArticle = article as Partial<Article>;

  return {
    id: Number(placeholderArticle.id),
    title: placeholderArticle.title || "Untitled",
    excerpt: placeholderArticle.excerpt || "",
    author: placeholderArticle.author || "Pump Parade Team",
    date: placeholderArticle.date || new Date().toISOString(),
    category: placeholderArticle.category || "Blog",
    readTime: placeholderArticle.readTime || "4 min read",
    image: placeholderArticle.image || "/placeholder.svg",
    url: placeholderArticle.url || "",
    content: placeholderArticle.content || "",
    tags: Array.isArray(placeholderArticle.tags) ? placeholderArticle.tags : [],
    tagNames: Array.isArray(placeholderArticle.tagNames)
      ? placeholderArticle.tagNames
      : Array.isArray(placeholderArticle.tags)
        ? placeholderArticle.tags
        : [],
    allCategories: Array.isArray(placeholderArticle.allCategories)
      ? placeholderArticle.allCategories
      : placeholderArticle.category
        ? [placeholderArticle.category]
        : [],
    categoryIds: Array.isArray(placeholderArticle.categoryIds)
      ? placeholderArticle.categoryIds
      : [],
    tagIds: Array.isArray(placeholderArticle.tagIds) ? placeholderArticle.tagIds : [],
  };
};

const ArticleContentSkeleton = () => (
  <div className="p-4 md:p-8 space-y-6">
    <Skeleton className="h-6 w-1/3" />
    <Skeleton className="h-5 w-full" />
    <Skeleton className="h-5 w-full" />
    <Skeleton className="h-5 w-11/12" />
    <Skeleton className="h-5 w-full" />
    <Skeleton className="h-5 w-10/12" />
  </div>
);

const Article = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const isMobile = window.matchMedia(`(max-width: ${768}px)`).matches;
  const customClass = useMemo(
    () => (isMobile ? "flex justify-center !px-4 mb-6" : "flex justify-center mb-6"),
    [isMobile]
  );
  const location = useLocation();
  const articleIdNumber = Number(articleId);
  const placeholderArticle = normalizePlaceholderArticle(location.state?.article);

  const [topGainersAndLosers, setTopGainersAndLosers] = useState<CryptoToken[]>([]);
  const articleQuery = useWordPressPost(
    Number.isNaN(articleIdNumber) ? undefined : articleIdNumber
  );
  const article = articleQuery.data || placeholderArticle;
  const relatedQuery = useRelatedWordPressArticles(
    articleQuery.data?.tagIds?.[0] || placeholderArticle?.tagIds?.[0],
    Number.isNaN(articleIdNumber) ? undefined : articleIdNumber
  );

  const seoData = article ? generateArticleSEO(article) : null;

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
    const fetchAndCacheTopGainersAndLosers = async () => {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setTopGainersAndLosers(data);
            return;
          }
        } catch (error) {
          // Ignore invalid cache and refetch.
        }
      }

      try {
        const data = await getAllCryptos();
        setTopGainersAndLosers(data);
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data, timestamp: Date.now() })
        );
      } catch (error) {
        // Ignore market widget failures on article view.
      }
    };

    fetchAndCacheTopGainersAndLosers();
  }, []);

  if (articleQuery.isLoading && !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading article...</div>
      </div>
    );
  }

  if (!article) {
    return <ArticleNotFound />;
  }

  const isFullArticleLoaded = Boolean(articleQuery.data?.content);

  return (
    <>
      {seoData ? (
        <AdvancedSEOHead
          seoData={seoData}
          author={article.author}
          publishDate={article.date}
          modifiedDate={article.date}
          readingTime={article.readTime}
          pageType="article"
        />
      ) : null}

      <EnhancedBreadcrumbSchema
        articleTitle={article.title}
        customBreadcrumbs={undefined}
        tokenName={undefined}
      />

      <AdvancedPerformanceOptimizer
        pageType="article"
        criticalResources={[article.image].filter(Boolean)}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="container mx-auto px-4 py-4 md:py-8">
          <IndexHeader
            selectedCrypto="bitcoin"
            cryptoOptions={cryptoOptions}
            currentPrice={45000}
            priceChange={2.5}
          />

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

          <div>
            <AdUnit
              isMobile={isMobile}
              className={customClass}
              adUnit={
                isMobile
                  ? "/22181265/pumpparade_mob_300v_1"
                  : "/22181265/pumpparade_970v_1"
              }
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 space-y-8">
              <Card className="bg-gray-800/50 border-gray-700 overflow-hidden rounded-lg">
                <ArticleHeader article={article} />
                <br />
                <br />
                <div className="flex justify-center">
                  <AdUnit
                    isMobile={isMobile}
                    className={customClass}
                    adUnit={
                      isMobile
                        ? "/22181265/pumpparade_mob_300v_2"
                        : "/22181265/pumpparade_970v_2"
                    }
                  />
                </div>

                {isFullArticleLoaded ? (
                  <ArticleContent
                    content={article.content || ""}
                    tags={article.tagNames}
                    articleId={article.id}
                    articleTitle={article.title}
                  />
                ) : articleQuery.isError ? (
                  <div className="p-4 md:p-8 text-gray-300">
                    Unable to load the full article content right now.
                  </div>
                ) : (
                  <ArticleContentSkeleton />
                )}
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                <AdUnit
                  isMobile={isMobile}
                  className={customClass}
                  adUnit={
                    isMobile
                      ? "/22181265/pumpparade_mob_stickyfooter"
                      : "/22181265/pumpparade_sticky_footer"
                  }
                />
              </div>

              <RelatedArticles articles={relatedQuery.articles} />
            </div>

            <div className="hidden lg:block">
              <div className="sticky top-8 space-y-8">
                <VdoBannerAd adUnit={""} />
                {isFullArticleLoaded ? (
                  <ArticleIndex content={article.content || ""} />
                ) : null}
                <MarketWinnersWidget
                  topGainnersandLoosers={topGainersAndLosers}
                />

                <AdUnit
                  className="flex justify-center mt-5"
                  adUnit="/22181265/pumpparade_stickyrail"
                />
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Article;
