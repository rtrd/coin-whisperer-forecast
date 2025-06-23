
import React from "react";
import { TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ArticleCard } from "@/components/ArticleCard";

interface BlogTrendingSectionProps {
  trendingArticles: any[];
}

export const BlogTrendingSection: React.FC<BlogTrendingSectionProps> = ({ trendingArticles }) => {
  if (trendingArticles.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-6 w-6 text-red-400" />
        <h2 className="text-2xl font-bold text-white">Trending Articles</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-auto">
        {/* #1 Trending - 30% bigger, takes more space */}
        <div className="lg:col-span-2 h-full">
          <div className="relative h-full">
            <div className="absolute -top-2 -left-2 z-10">
              <Badge className="bg-yellow-600 text-black font-bold text-sm px-3 py-1">
                #1
              </Badge>
            </div>
            <ArticleCard 
              key={trendingArticles[0].id} 
              article={trendingArticles[0]} 
              variant="blog"
              highlighted={true}
            />
          </div>
        </div>
        
        {/* #2-#5 Trending - smaller cards in sidebar */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
          {trendingArticles.slice(1, 5).map((article, index) => (
            <div key={article.id} className="relative h-full">
              <div className="absolute -top-2 -left-2 z-10">
                <Badge className="bg-gray-600 text-white font-bold text-sm px-2 py-1">
                  #{index + 2}
                </Badge>
              </div>
              <ArticleCard 
                article={article} 
                variant="blog" 
                compact={true}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
