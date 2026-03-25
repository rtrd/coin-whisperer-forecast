import React, { useEffect, useState } from "react";
import { ArticleFilterState, ViewMode } from "@/types/blog";
import { BlogArticleFilters } from "./BlogArticleFilters";
import { BlogArticlesList } from "./BlogArticlesList";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen } from "lucide-react";
import { useWordPressArchive, useWordPressCategories } from "@/hooks/useWordPressArticles";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

const initialFilters: ArticleFilterState = {
  searchTerm: "",
  categoryId: "",
  tags: [],
  dateRange: {
    start: "",
    end: "",
  },
  sortBy: "date",
  sortOrder: "desc",
};

const ArchiveSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="h-12 w-full" />
      ))}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="space-y-3">
          <Skeleton className="aspect-[4/3] w-full rounded-lg" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  </div>
);

export const BlogIndexSection: React.FC = () => {
  const [filters, setFilters] = useState<ArticleFilterState>(initialFilters);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const categoriesQuery = useWordPressCategories();
  const archiveQuery = useWordPressArchive(filters);
  const {
    articles,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isLoading,
    totalResults,
  } = archiveQuery;
  const { ref: loadMoreRef, isIntersecting } = useIntersectionObserver({
    threshold: 0,
    rootMargin: "400px",
    triggerOnce: false,
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isIntersecting]);

  const updateFilters = (newFilters: Partial<ArticleFilterState>) => {
    setFilters((previousFilters) => ({
      ...previousFilters,
      ...newFilters,
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const hasArticles = articles.length > 0;

  return (
    <div className="mb-12 mt-12">
      <div className="flex items-center gap-2 mb-8">
        <BookOpen className="h-6 w-6 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">
          Blog Archive ({totalResults} articles)
        </h2>
      </div>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          <BlogArticleFilters
            filters={filters}
            onUpdateFilters={updateFilters}
            onResetFilters={resetFilters}
            categories={categoriesQuery.data || []}
            resultsCount={totalResults}
          />

          {isLoading ? <ArchiveSkeleton /> : null}

          {!isLoading && hasArticles ? (
            <>
              <BlogArticlesList
                articles={articles}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                totalArticles={totalResults}
              />

              <div ref={loadMoreRef} className="mt-8 flex justify-center">
                {isFetchingNextPage ? (
                  <div className="text-sm text-gray-400">Loading more articles...</div>
                ) : null}
                {!hasNextPage ? (
                  <div className="text-sm text-gray-500">All articles loaded.</div>
                ) : null}
              </div>
            </>
          ) : null}

          {!isLoading && isError ? (
            <div className="text-center py-12">
              <div className="text-white text-lg mb-4">
                Unable to load the archive right now
              </div>
              <p className="text-gray-400 mb-6">
                Please try again in a moment.
              </p>
            </div>
          ) : null}

          {!isLoading && !isError && !hasArticles ? (
            <div className="text-center py-12">
              <div className="text-white text-lg mb-4">
                No articles found matching your criteria
              </div>
              <p className="text-gray-400 mb-6">
                Try adjusting your filters or search terms
              </p>
              <button
                onClick={resetFilters}
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Clear all filters
              </button>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};
