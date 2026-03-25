import { generateBlogSEO } from "@/utils/pageSeo";
import { useAdScript } from "@/hooks/useAdScript";
import React, { useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { GAMAdUnit } from "@/components/ads/GAMAdUnit";
import { BlogHeader } from "@/components/blog/BlogHeader";
import { BlogLayout } from "@/components/blog/BlogLayout";
import { EnhancedSEOHead } from "@/components/seo/EnhancedSEOHead";
import { BlogIndexSection } from "@/components/blog/BlogIndexSection";
import { BlogLatestSection } from "@/components/blog/BlogLatestSection";
import { BlogFeaturedSection } from "@/components/blog/BlogFeaturedSection";
import { BlogTrendingSection } from "@/components/blog/BlogTrendingSection";
import { BlogCategoriesSection } from "@/components/blog/BlogCategoriesSection";
import {
  useWordPressCategories,
  useWordPressPostsPage,
} from "@/hooks/useWordPressArticles";

const BlogSectionSkeleton = ({ cards = 4 }: { cards?: number }) => (
  <div className="mb-12">
    <div className="flex items-center gap-2 mb-6">
      <Skeleton className="h-6 w-6 rounded-full" />
      <Skeleton className="h-8 w-48" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: cards }).map((_, index) => (
        <div key={index} className="space-y-3">
          <Skeleton className="aspect-[4/3] w-full rounded-lg" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  </div>
);

const Blog = () => {
  const location = useLocation();
  const archiveRef = useRef<HTMLDivElement>(null);

  useAdScript();

  const seoData = generateBlogSEO();
  const categoriesQuery = useWordPressCategories();

  const featuredCategoryId = useMemo(
    () => categoriesQuery.data?.find((category) => category.slug === "featured")?.id,
    [categoriesQuery.data]
  );
  const trendingCategoryId = useMemo(
    () => categoriesQuery.data?.find((category) => category.slug === "trending")?.id,
    [categoriesQuery.data]
  );

  const featuredQuery = useWordPressPostsPage(
    {
      page: 1,
      perPage: 1,
      categoryId: featuredCategoryId,
    },
    {
      enabled: Boolean(featuredCategoryId),
    }
  );
  const trendingQuery = useWordPressPostsPage(
    {
      page: 1,
      perPage: 5,
      categoryId: trendingCategoryId,
    },
    {
      enabled: Boolean(trendingCategoryId),
    }
  );
  const latestQuery = useWordPressPostsPage({
    page: 1,
    perPage: 12,
  });

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
    if (location.state?.scrollToArchive) {
      const timeoutId = window.setTimeout(() => {
        archiveRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);

      return () => window.clearTimeout(timeoutId);
    }
  }, [location.state]);

  return (
    <>
      <EnhancedSEOHead seoData={seoData} />

      <BlogLayout cryptoOptions={cryptoOptions}>
        <BlogHeader />

        <GAMAdUnit
          adUnitId="div-gpt-ad-1752654531765-0"
          size={[728, 90]}
          className="mb-6 md:mb-8"
        />

        {featuredQuery.data?.articles[0] ? (
          <BlogFeaturedSection featuredArticle={featuredQuery.data.articles[0]} />
        ) : null}
        {featuredQuery.isLoading || categoriesQuery.isLoading ? (
          <BlogSectionSkeleton cards={1} />
        ) : null}

        {trendingQuery.data?.articles?.length ? (
          <BlogTrendingSection trendingArticles={trendingQuery.data.articles} />
        ) : null}
        {trendingQuery.isLoading || categoriesQuery.isLoading ? (
          <BlogSectionSkeleton cards={4} />
        ) : null}

        {latestQuery.data?.articles?.length ? (
          <BlogLatestSection latestArticles={latestQuery.data.articles} />
        ) : null}
        {latestQuery.isLoading ? <BlogSectionSkeleton cards={4} /> : null}

        <BlogCategoriesSection />

        <div ref={archiveRef}>
          <BlogIndexSection />
        </div>

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
