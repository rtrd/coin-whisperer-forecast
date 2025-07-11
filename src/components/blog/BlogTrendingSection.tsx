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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 auto-rows-max items-end">
        {/* #1 Trending - 30% bigger, takes more space, with #1 badge */}
        <div className="lg:col-span-2 flex flex-col h-full">
          <div className="relative flex-1 flex flex-col">
            <div className="absolute -top-2 -left-2 z-10">
              <Badge className="bg-gray-600 text-white font-bold text-sm px-2 py-1">
                #1
              </Badge>
            </div>
            <div className="flex-1">
              <ArticleCard
                key={trendingArticles[0].id}
                article={trendingArticles[0]}
                variant="blog"
                highlighted={true}
              />
            </div>
          </div>
        </div>

        {/* #2-#5 Trending - smaller cards in sidebar */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 content-end h-full">
          {trendingArticles.slice(1, 5).map((article, index) => (
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
    </div>
  );
};
