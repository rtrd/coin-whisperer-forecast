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
  tags: string[];
  tagNames: string[];
  allCategories: string[];
  categoryIds: number[];
  tagIds: number[];
}

export interface ArticleFilterState {
  searchTerm: string;
  categoryId: string;
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

export interface WordPressTaxonomyTerm {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface WordPressPostsPageParams {
  page?: number;
  perPage?: number;
  search?: string;
  categoryId?: number;
  after?: string;
  before?: string;
  orderBy?: 'date' | 'title' | 'relevance';
  order?: 'asc' | 'desc';
  tagId?: number;
  excludeId?: number;
}

export interface WordPressPostsPage {
  articles: Article[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
}

export interface CategorySectionData {
  category: WordPressTaxonomyTerm;
  articles: Article[];
}
