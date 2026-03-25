import React from "react";
import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";
import { Article, ViewMode } from "@/types/blog";
import { ArticleCard } from "@/components/ArticleCard";
import { BlogArticlesTable } from "./BlogArticlesTable";

interface BlogArticlesListProps {
  articles: Article[];
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalArticles: number;
}

export const BlogArticlesList: React.FC<BlogArticlesListProps> = ({
  articles,
  viewMode,
  onViewModeChange,
  totalArticles,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-white font-medium">View:</span>
          <div className="flex border border-border/30 rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
              className={`h-8 px-3 ${viewMode !== "grid" ? "text-gray-300" : ""}`}
            >
              <Grid className="h-4 w-4 mr-1" />
              Grid
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("table")}
              className={`h-8 px-3 ${viewMode !== "table" ? "text-gray-300" : ""}`}
            >
              <List className="h-4 w-4 mr-1" />
              Table
            </Button>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          Showing 1-{articles.length} of {totalArticles} articles
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              variant="blog"
              compact={true}
            />
          ))}
        </div>
      ) : (
        <BlogArticlesTable articles={articles} />
      )}
    </div>
  );
};
