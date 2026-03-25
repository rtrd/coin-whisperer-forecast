import { useDeferredValue, useMemo } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  Article,
  ArticleFilterState,
  CategorySectionData,
  WordPressPostsPage,
  WordPressPostsPageParams,
  WordPressTaxonomyTerm,
} from "@/types/blog";
import { apiService } from "@/services/apiService";
import { createTaxonomyMap, hydrateArticle, hydrateArticles } from "@/utils/wordPressArticles";

const FIVE_MINUTES = 5 * 60 * 1000;
const THIRTY_MINUTES = 30 * 60 * 1000;

export const useWordPressCategories = () => {
  return useQuery<WordPressTaxonomyTerm[]>({
    queryKey: ["wordpress", "categories"],
    queryFn: () => apiService.getWordPressCategories(),
    staleTime: THIRTY_MINUTES,
  });
};

export const useWordPressTags = () => {
  return useQuery<WordPressTaxonomyTerm[]>({
    queryKey: ["wordpress", "tags"],
    queryFn: () => apiService.getWordPressTags(),
    staleTime: THIRTY_MINUTES,
  });
};

export const useWordPressPostsPage = (
  params: WordPressPostsPageParams,
  options?: { enabled?: boolean }
) => {
  const categoriesQuery = useWordPressCategories();
  const categoryMap = useMemo(
    () => createTaxonomyMap(categoriesQuery.data),
    [categoriesQuery.data]
  );

  const postsQuery = useQuery<WordPressPostsPage>({
    queryKey: ["wordpress", "posts", params],
    queryFn: () => apiService.getWordPressPostsPage(params),
    enabled: options?.enabled ?? true,
    staleTime: FIVE_MINUTES,
  });

  const data = useMemo(() => {
    if (!postsQuery.data) {
      return undefined;
    }

    return {
      ...postsQuery.data,
      articles: hydrateArticles(postsQuery.data.articles, categoryMap),
    };
  }, [categoryMap, postsQuery.data]);

  return {
    ...postsQuery,
    data,
  };
};

export const useWordPressArchive = (filters: ArticleFilterState) => {
  const categoriesQuery = useWordPressCategories();
  const categoryMap = useMemo(
    () => createTaxonomyMap(categoriesQuery.data),
    [categoriesQuery.data]
  );
  const deferredSearchTerm = useDeferredValue(filters.searchTerm.trim());

  const queryParams = useMemo<WordPressPostsPageParams>(
    () => ({
      perPage: 24,
      search: deferredSearchTerm || undefined,
      categoryId: filters.categoryId ? Number(filters.categoryId) : undefined,
      after: filters.dateRange.start
        ? `${filters.dateRange.start}T00:00:00`
        : undefined,
      before: filters.dateRange.end
        ? `${filters.dateRange.end}T23:59:59`
        : undefined,
      orderBy: filters.sortBy as WordPressPostsPageParams["orderBy"],
      order: filters.sortOrder,
    }),
    [deferredSearchTerm, filters.categoryId, filters.dateRange.end, filters.dateRange.start, filters.sortBy, filters.sortOrder]
  );

  const archiveQuery = useInfiniteQuery({
    queryKey: ["wordpress", "archive", queryParams],
    queryFn: ({ pageParam }) =>
      apiService.getWordPressPostsPage({
        ...queryParams,
        page: Number(pageParam),
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    staleTime: FIVE_MINUTES,
  });

  const pages = useMemo(() => {
    return (
      archiveQuery.data?.pages.map((page) => ({
        ...page,
        articles: hydrateArticles(page.articles, categoryMap),
      })) || []
    );
  }, [archiveQuery.data?.pages, categoryMap]);

  const articles = useMemo(
    () => pages.flatMap((page) => page.articles),
    [pages]
  );

  return {
    ...archiveQuery,
    pages,
    articles,
    totalResults: pages[0]?.total ?? 0,
  };
};

export const useWordPressPost = (postId?: number) => {
  const categoriesQuery = useWordPressCategories();
  const tagsQuery = useWordPressTags();
  const categoryMap = useMemo(
    () => createTaxonomyMap(categoriesQuery.data),
    [categoriesQuery.data]
  );
  const tagMap = useMemo(() => createTaxonomyMap(tagsQuery.data), [tagsQuery.data]);

  const postQuery = useQuery<Article>({
    queryKey: ["wordpress", "post", postId],
    queryFn: () => apiService.getWordPressPostById(postId!),
    enabled: typeof postId === "number" && !Number.isNaN(postId),
    staleTime: FIVE_MINUTES,
  });

  const data = useMemo(() => {
    if (!postQuery.data) {
      return undefined;
    }

    return hydrateArticle(postQuery.data, categoryMap, tagMap);
  }, [categoryMap, postQuery.data, tagMap]);

  return {
    ...postQuery,
    data,
  };
};

export const useRelatedWordPressArticles = (tagId?: number, excludeId?: number) => {
  const categoriesQuery = useWordPressCategories();
  const tagsQuery = useWordPressTags();
  const categoryMap = useMemo(
    () => createTaxonomyMap(categoriesQuery.data),
    [categoriesQuery.data]
  );
  const tagMap = useMemo(() => createTaxonomyMap(tagsQuery.data), [tagsQuery.data]);

  const relatedQuery = useQuery<WordPressPostsPage>({
    queryKey: ["wordpress", "related", tagId, excludeId],
    queryFn: () =>
      apiService.getWordPressPostsPage({
        page: 1,
        perPage: 4,
        tagId,
        excludeId,
      }),
    enabled: Boolean(tagId && excludeId),
    staleTime: FIVE_MINUTES,
  });

  const articles = useMemo(() => {
    return hydrateArticles(relatedQuery.data?.articles || [], categoryMap, tagMap);
  }, [categoryMap, relatedQuery.data?.articles, tagMap]);

  return {
    ...relatedQuery,
    articles,
  };
};

export const useWordPressCategorySections = (enabled: boolean) => {
  const categoriesQuery = useWordPressCategories();
  const categories = useMemo(
    () => categoriesQuery.data ?? [],
    [categoriesQuery.data]
  );
  const categoryMap = useMemo(
    () => createTaxonomyMap(categories),
    [categories]
  );

  return useQuery<CategorySectionData[]>({
    queryKey: [
      "wordpress",
      "category-sections",
      categories.map((category) => category.id).join(","),
    ],
    queryFn: async () => {
      const filteredCategories = categories.filter(
        (category) => !["featured", "trending"].includes(category.slug)
      );
      const sections: CategorySectionData[] = [];

      for (let index = 0; index < filteredCategories.length; index += 3) {
        const batch = filteredCategories.slice(index, index + 3);
        const batchSections = await Promise.all(
          batch.map(async (category) => {
            const page = await apiService.getWordPressPostsPage({
              page: 1,
              perPage: 4,
              categoryId: category.id,
            });

            return {
              category,
              articles: hydrateArticles(page.articles, categoryMap),
            };
          })
        );

        sections.push(...batchSections.filter((section) => section.articles.length > 0));
      }

      return sections;
    },
    enabled: enabled && categories.length > 0,
    staleTime: FIVE_MINUTES,
  });
};
