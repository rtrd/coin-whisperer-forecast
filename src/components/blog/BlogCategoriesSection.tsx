import React from "react";
import { Hash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArticleCard } from "@/components/ArticleCard";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useWordPressCategorySections } from "@/hooks/useWordPressArticles";

const CategoriesSkeleton = () => (
  <Card className="bg-gray-800/50 border-gray-700">
    <CardHeader>
      <CardTitle className="text-white flex items-center gap-2 text-2xl">
        <Hash className="h-6 w-6 text-blue-400" />
        Categories
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-28 w-full rounded-lg" />
            <Skeleton className="h-28 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export const BlogCategoriesSection: React.FC = () => {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "300px",
  });
  const categorySectionsQuery = useWordPressCategorySections(isIntersecting);

  return (
    <div ref={ref}>
      {categorySectionsQuery.isLoading || !isIntersecting ? <CategoriesSkeleton /> : null}

      {categorySectionsQuery.data?.length ? (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2 text-2xl">
              <Hash className="h-6 w-6 text-blue-400" />
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categorySectionsQuery.data.map(({ category, articles }) => (
                <div key={category.id} className="space-y-3">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Hash className="h-4 w-4 text-blue-400" />
                    {category.name}
                    <span className="text-gray-400 text-sm font-normal">
                      ({category.count})
                    </span>
                  </h3>
                  <div className="space-y-3">
                    {articles.map((article) => (
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
      ) : null}
    </div>
  );
};
