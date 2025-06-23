import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArticleCard } from "./ArticleCard";
import { ChevronDown, ChevronUp, Hash } from "lucide-react";

interface CategorySectionProps {
  categoryName: string;
  articles: any[];
  isVertical?: boolean;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  categoryName,
  articles,
  isVertical = false,
}) => {
  const [expanded, setExpanded] = useState(false);
  const displayArticles = expanded ? articles : articles.slice(0, 5);
  const hasMore = articles.length > 5;

  if (articles.length === 0) return null;

  const gridClasses = isVertical 
    ? "space-y-3" 
    : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6";

  return (
    <Card className="bg-gray-800/50 border-gray-700 h-fit">
      <CardHeader className={isVertical ? "pb-3" : ""}>
        <CardTitle className={`text-white flex items-center gap-2 ${isVertical ? 'text-lg' : 'text-xl'}`}>
          <Hash className={`${isVertical ? 'h-4 w-4' : 'h-5 w-5'} text-blue-400`} />
          {categoryName}
          <span className="text-gray-400 text-sm font-normal">
            ({articles.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className={isVertical ? "pt-0" : ""}>
        <div className={`${gridClasses} ${isVertical ? 'mb-3' : 'mb-6'}`}>
          {displayArticles.map((article) => (
            <ArticleCard 
              key={article.id} 
              article={article} 
              compact={isVertical}
              variant="blog"
            />
          ))}
        </div>
        
        {hasMore && (
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => setExpanded(!expanded)}
              className={`bg-gray-700 border-gray-600 text-white hover:bg-gray-600 ${isVertical ? 'text-xs px-3 py-1' : ''}`}
            >
              {expanded ? (
                <>
                  <ChevronUp className={`${isVertical ? 'h-3 w-3' : 'h-4 w-4'} mr-1`} />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className={`${isVertical ? 'h-3 w-3' : 'h-4 w-4'} mr-1`} />
                  Show More ({articles.length - 5})
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
