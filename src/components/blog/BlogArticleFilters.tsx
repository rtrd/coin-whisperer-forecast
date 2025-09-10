import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Search, Calendar, Tag, Filter } from "lucide-react";
import { ArticleFilterState, Article } from "@/types/blog";

interface BlogArticleFiltersProps {
  filters: ArticleFilterState;
  onUpdateFilters: (newFilters: Partial<ArticleFilterState>) => void;
  onResetFilters: () => void;
  articles: Article[];
  resultsCount: number;
}

export const BlogArticleFilters: React.FC<BlogArticleFiltersProps> = ({
  filters,
  onUpdateFilters,
  onResetFilters,
  articles,
  resultsCount,
}) => {
  // Extract unique values from articles (exclude special categories)
  const uniqueCategories = useMemo(() => {
    const categories = articles.flatMap(article => 
      article.allCategories || [article.category]
    );
    const filtered = categories.filter(category => 
      !["Featured", "Trending"].includes(category)
    );
    return Array.from(new Set(filtered)).sort();
  }, [articles]);

  const uniqueTags = useMemo(() => {
    const tags = articles.flatMap(article => article.tagNames || []);
    return Array.from(new Set(tags)).sort();
  }, [articles]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.category !== 'all') count++;
    if (filters.tags.length > 0) count++;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    return count;
  }, [filters]);

  return (
    <div className="space-y-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">
            Filter Articles
          </h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="bg-blue-600 text-white">
              {activeFiltersCount} active
            </Badge>
          )}
        </div>
        <div className="text-sm text-gray-400">
          {resultsCount} article{resultsCount !== 1 ? 's' : ''} found
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">
            <Search className="h-4 w-4 inline mr-1" />
            Search
          </label>
          <Input
            placeholder="Search title, content..."
            value={filters.searchTerm}
            onChange={(e) => onUpdateFilters({ searchTerm: e.target.value })}
            className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
          />
        </div>

        {/* Category Filter */}
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">
            <Tag className="h-4 w-4 inline mr-1" />
            Category
          </label>
          <Select
            value={filters.category}
            onValueChange={(value) => onUpdateFilters({ category: value })}
          >
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="all" className="text-white">All Categories</SelectItem>
              {uniqueCategories.map(category => (
                <SelectItem key={category} value={category} className="text-white">
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort By */}
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">
            Sort By
          </label>
          <Select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onValueChange={(value) => {
              const [sortBy, sortOrder] = value.split('-') as [string, 'asc' | 'desc'];
              onUpdateFilters({ sortBy, sortOrder });
            }}
          >
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="date-desc" className="text-white">Newest First</SelectItem>
              <SelectItem value="date-asc" className="text-white">Oldest First</SelectItem>
              <SelectItem value="title-asc" className="text-white">Title (A-Z)</SelectItem>
              <SelectItem value="title-desc" className="text-white">Title (Z-A)</SelectItem>
              <SelectItem value="category-asc" className="text-white">Category (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">
            <Calendar className="h-4 w-4 inline mr-1" />
            From Date
          </label>
          <Input
            type="date"
            value={filters.dateRange.start}
            onChange={(e) => onUpdateFilters({ 
              dateRange: { ...filters.dateRange, start: e.target.value }
            })}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">
            To Date
          </label>
          <Input
            type="date"
            value={filters.dateRange.end}
            onChange={(e) => onUpdateFilters({ 
              dateRange: { ...filters.dateRange, end: e.target.value }
            })}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
      </div>

      {/* Selected Tags Display & Reset */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {filters.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {filters.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="bg-blue-600 text-white">
                  {tag}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => onUpdateFilters({ 
                      tags: filters.tags.filter(t => t !== tag) 
                    })}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        {activeFiltersCount > 0 && (
          <Button
            onClick={onResetFilters}
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <X className="h-4 w-4 mr-1" />
            Reset All
          </Button>
        )}
      </div>
    </div>
  );
};