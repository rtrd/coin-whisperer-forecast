import React from "react";
import { Button } from "@/components/ui/button";
import { Grid, List, ChevronLeft, ChevronRight } from "lucide-react";
import { Article, ViewMode } from "@/types/blog";
import { ArticleCard } from "@/components/ArticleCard";
import { BlogArticlesTable } from "./BlogArticlesTable";

interface BlogArticlesListProps {
  articles: Article[];
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  articlesPerPage: number;
}

export const BlogArticlesList: React.FC<BlogArticlesListProps> = ({
  articles,
  viewMode,
  onViewModeChange,
  currentPage,
  totalPages,
  onPageChange,
  articlesPerPage,
}) => {
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = Math.min(startIndex + articlesPerPage, articles.length);
  const paginatedArticles = articles.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-white font-medium">View:</span>
          <div className="flex border border-border/30 rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className={`h-8 px-3 ${viewMode !== 'grid' ? 'text-gray-300' : ''}`}
            >
              <Grid className="h-4 w-4 mr-1" />
              Grid
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('table')}
              className={`h-8 px-3 ${viewMode !== 'table' ? 'text-gray-300' : ''}`}
            >
              <List className="h-4 w-4 mr-1" />
              Table
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1}-{endIndex} of {articles.length} articles
        </div>
      </div>

      {/* Articles Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              variant="blog"
              compact={true}
            />
          ))}
        </div>
      ) : (
        <BlogArticlesTable articles={paginatedArticles} />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="border-border/50"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = Math.max(1, currentPage - 2) + i;
              if (page > totalPages) return null;
              
              return (
                <Button
                  key={page}
                  variant={page === currentPage ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange(page)}
                  className="w-8 h-8 p-0 border-border/50"
                >
                  {page}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="border-border/50"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
};