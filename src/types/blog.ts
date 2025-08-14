export interface Article {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
  url: string;
  content?: string;
  tags?: string[];
  tagNames?: string[];
  allCategories?: string[];
}

export interface ArticleFilterState {
  searchTerm: string;
  category: string;
  tags: string[];
  dateRange: {
    start: string;
    end: string;
  };
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface BlogIndexSectionProps {
  articles: Article[];
}

export type ViewMode = 'grid' | 'table';