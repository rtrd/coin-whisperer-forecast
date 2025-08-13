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
import { X, Search, Calendar, User, Tag, Filter } from "lucide-react";
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
  // Extract unique values from articles
  const { categories, authors, allTags } = useMemo(() => {
    const categoriesSet = new Set<string>();
    const authorsSet = new Set<string>();
    const tagsSet = new Set<string>();

    articles.forEach(article => {
      if (article.category) categoriesSet.add(article.category);
      if (article.author) authorsSet.add(article.author);
      if (article.allCategories) {
        article.allCategories.forEach(cat => categoriesSet.add(cat));
      }
      if (article.tagNames) {
        article.tagNames.forEach(tag => tagsSet.add(tag));
      }
    });

    return {
      categories: Array.from(categoriesSet).sort(),
      authors: Array.from(authorsSet).sort(),
      allTags: Array.from(tagsSet).sort()
    };
  }, [articles]);

  const activeFiltersCount = [
    filters.searchTerm,
    filters.category !== 'all' ? filters.category : '',
    filters.author !== 'all' ? filters.author : '',
    filters.tags.length > 0 ? 'tags' : '',
    filters.dateRange.start || filters.dateRange.end ? 'date' : ''
  ].filter(Boolean).length;

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border/20 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Filter Articles</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="bg-primary/20 text-primary">
              {activeFiltersCount} active
            </Badge>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          {resultsCount} article{resultsCount !== 1 ? 's' : ''} found
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
        {/* Search */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            <Search className="h-4 w-4 inline mr-1" />
            Search
          </label>
          <Input
            placeholder="Search title, content..."
            value={filters.searchTerm}
            onChange={(e) => onUpdateFilters({ searchTerm: e.target.value })}
            className="bg-background/50 border-border/50"
          />
        </div>

        {/* Category Filter */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            <Tag className="h-4 w-4 inline mr-1" />
            Category
          </label>
          <Select
            value={filters.category}
            onValueChange={(value) => onUpdateFilters({ category: value })}
          >
            <SelectTrigger className="bg-background/50 border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background border-border z-50">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Author Filter */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            <User className="h-4 w-4 inline mr-1" />
            Author
          </label>
          <Select
            value={filters.author}
            onValueChange={(value) => onUpdateFilters({ author: value })}
          >
            <SelectTrigger className="bg-background/50 border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background border-border z-50">
              <SelectItem value="all">All Authors</SelectItem>
              {authors.map(author => (
                <SelectItem key={author} value={author}>
                  {author}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort By */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Sort By
          </label>
          <Select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onValueChange={(value) => {
              const [sortBy, sortOrder] = value.split('-') as [string, 'asc' | 'desc'];
              onUpdateFilters({ sortBy, sortOrder });
            }}
          >
            <SelectTrigger className="bg-background/50 border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background border-border z-50">
              <SelectItem value="date-desc">Newest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
              <SelectItem value="title-asc">Title (A-Z)</SelectItem>
              <SelectItem value="title-desc">Title (Z-A)</SelectItem>
              <SelectItem value="author-asc">Author (A-Z)</SelectItem>
              <SelectItem value="category-asc">Category (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            <Calendar className="h-4 w-4 inline mr-1" />
            From Date
          </label>
          <Input
            type="date"
            value={filters.dateRange.start}
            onChange={(e) => onUpdateFilters({ 
              dateRange: { ...filters.dateRange, start: e.target.value }
            })}
            className="bg-background/50 border-border/50"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            To Date
          </label>
          <Input
            type="date"
            value={filters.dateRange.end}
            onChange={(e) => onUpdateFilters({ 
              dateRange: { ...filters.dateRange, end: e.target.value }
            })}
            className="bg-background/50 border-border/50"
          />
        </div>
      </div>

      {/* Selected Tags Display & Reset */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {filters.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="bg-primary/20 text-primary">
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
            className="border-border/50 hover:bg-muted/50"
          >
            <X className="h-4 w-4 mr-1" />
            Reset All
          </Button>
        )}
      </div>
    </div>
  );
};