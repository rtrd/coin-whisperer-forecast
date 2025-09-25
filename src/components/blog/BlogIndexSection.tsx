import React, { useState, useMemo } from "react";
import { ArticleFilterState, Article, ViewMode } from "@/types/blog";
import { BlogArticleFilters } from "./BlogArticleFilters";
import { BlogArticlesList } from "./BlogArticlesList";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

interface BlogIndexSectionProps {
  articles: Article[];
}

const initialFilters: ArticleFilterState = {
  searchTerm: '',
  category: 'all',
  tags: [],
  dateRange: {
    start: '',
    end: ''
  },
  sortBy: 'date',
  sortOrder: 'desc'
};

export const BlogIndexSection: React.FC<BlogIndexSectionProps> = ({ articles }) => {
  const [filters, setFilters] = useState<ArticleFilterState>(initialFilters);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 12;

  const updateFilters = (newFilters: Partial<ArticleFilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setCurrentPage(1);
  };

  // Filter and sort articles
  const filteredArticles = useMemo(() => {
    // First exclude articles with special categories
    let filtered = articles.filter(article => {
      const categories = article.allCategories || [article.category];
      const hasSpecialCategory = categories.some((category: string) => 
        ["Featured", "Trending"].includes(category)
      );
      return !hasSpecialCategory;
    }).filter(article => {
      // Search filter
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        const searchIn = [
          article.title,
          article.excerpt,
          article.content || '',
          ...(article.tagNames || [])
        ].join(' ').toLowerCase();
        
        if (!searchIn.includes(searchTerm)) return false;
      }

      // Category filter
      if (filters.category !== 'all') {
        const articleCategories = article.allCategories || [article.category];
        if (!articleCategories.includes(filters.category)) return false;
      }

      // Tags filter
      if (filters.tags.length > 0) {
        const articleTags = article.tagNames || [];
        if (!filters.tags.some(tag => articleTags.includes(tag))) {
          return false;
        }
      }

      // Date range filter
      if (filters.dateRange.start || filters.dateRange.end) {
        const articleDate = new Date(article.date);
        if (filters.dateRange.start && articleDate < new Date(filters.dateRange.start)) {
          return false;
        }
        if (filters.dateRange.end && articleDate > new Date(filters.dateRange.end)) {
          return false;
        }
      }

      return true;
    });

    // Sort articles
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (filters.sortBy) {
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'category':
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [articles, filters]);

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  return (
    <div className="mb-12 mt-12">
      <div className="flex items-center gap-2 mb-8">
        <BookOpen className="h-6 w-6 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Blog Archive</h2>
      </div>
      
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          {/* Filters */}
          <BlogArticleFilters
            filters={filters}
            onUpdateFilters={updateFilters}
            onResetFilters={resetFilters}
            articles={articles}
            resultsCount={filteredArticles.length}
          />

          {/* Results */}
          {filteredArticles.length > 0 ? (
            <BlogArticlesList
              articles={filteredArticles}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              articlesPerPage={articlesPerPage}
            />
          ) : (
            <div className="text-center py-12">
              <div className="text-white text-lg mb-4">
                No articles found matching your criteria
              </div>
              <p className="text-gray-400 mb-6">
                Try adjusting your filters or search terms
              </p>
              <button
                onClick={resetFilters}
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};