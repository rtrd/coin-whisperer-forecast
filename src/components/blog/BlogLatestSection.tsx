
import React from "react";
import { Clock } from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";

interface BlogLatestSectionProps {
  latestArticles: any[];
}

export const BlogLatestSection: React.FC<BlogLatestSectionProps> = ({ latestArticles }) => {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="h-6 w-6 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Latest Articles</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {latestArticles.map((article) => (
          <ArticleCard key={article.id} article={article} variant="blog" />
        ))}
      </div>
    </div>
  );
};
