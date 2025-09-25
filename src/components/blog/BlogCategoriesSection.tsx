import React from "react";
import { Hash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArticleCard } from "@/components/ArticleCard";

interface BlogCategoriesSectionProps {
  categories: { [key: string]: any[] };
}

export const BlogCategoriesSection: React.FC<BlogCategoriesSectionProps> = ({
  categories,
}) => {
  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2 text-2xl">
          <Hash className="h-6 w-6 text-blue-400" />
          Categories
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(categories).map(
            ([categoryName, categoryArticles]) => (
              <div key={categoryName} className="space-y-3">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Hash className="h-4 w-4 text-blue-400" />
                  {categoryName}
                  <span className="text-gray-400 text-sm font-normal">
                    ({categoryArticles.length})
                  </span>
                </h3>
                <div className="space-y-3">
                  {categoryArticles.slice(0, 4).map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      variant="blog"
                      horizontal={true}
                    />
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
};
