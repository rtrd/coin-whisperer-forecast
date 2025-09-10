import React from "react";
import { TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ArticleCard } from "@/components/ArticleCard";

interface BlogTrendingSectionProps {
  trendingArticles: any[];
}

export const BlogTrendingSection: React.FC<BlogTrendingSectionProps> = ({
  trendingArticles,
}) => {
  if (trendingArticles.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-6 w-6 text-red-400" />
        <h2 className="text-2xl font-bold text-white">Trending Articles</h2>
      </div>

      {trendingArticles.length === 1 ? (
        // Single trending article - full width
        <div className="relative">
          <div className="absolute -top-2 -left-2 z-10">
            <Badge className="bg-gray-600 text-white font-bold text-sm px-2 py-1">
              #1
            </Badge>
          </div>
          <ArticleCard
            article={trendingArticles[0]}
            variant="blog"
            highlighted={true}
          />
        </div>
      ) : (
        // Multiple trending articles - grid layout
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:grid-rows-1 items-stretch">
          {/* #1 Trending - takes full height, with #1 badge */}
          <div className="lg:col-span-2 relative flex flex-col min-h-full">
            <div className="absolute -top-2 -left-2 z-10">
              <Badge className="bg-gray-600 text-white font-bold text-sm px-2 py-1">
                #1
              </Badge>
            </div>
            <div className="flex-1 h-full">
              <ArticleCard
                article={trendingArticles[0]}
                variant="blog"
                highlighted={true}
              />
            </div>
          </div>

          {/* Remaining trending articles - smaller cards */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-full">
            {trendingArticles.slice(1).map((article, index) => (
              <div key={article.id} className="relative flex flex-col">
                <div className="absolute -top-2 -left-2 z-10">
                  <Badge className="bg-gray-600 text-white font-bold text-sm px-2 py-1">
                    #{index + 2}
                  </Badge>
                </div>
                <div className="flex-1">
                  <ArticleCard article={article} variant="blog" compact={true} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
