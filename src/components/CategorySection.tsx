
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArticleCard } from "./ArticleCard";
import { ChevronDown, ChevronUp, Hash } from "lucide-react";

interface CategorySectionProps {
  categoryName: string;
  articles: any[];
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  categoryName,
  articles,
}) => {
  const [expanded, setExpanded] = useState(false);
  const displayArticles = expanded ? articles : articles.slice(0, 5);
  const hasMore = articles.length > 5;

  if (articles.length === 0) return null;

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Hash className="h-5 w-5 text-blue-400" />
          {categoryName}
          <span className="text-gray-400 text-sm font-normal">
            ({articles.length} articles)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
          {displayArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
        
        {hasMore && (
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => setExpanded(!expanded)}
              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            >
              {expanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-2" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-2" />
                  Show More ({articles.length - 5} more articles)
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
