import { Article, WordPressTaxonomyTerm } from "@/types/blog";

const SPECIAL_CATEGORY_NAMES = new Set(["Featured", "Trending", "Uncategorized"]);

export const createTaxonomyMap = (terms: WordPressTaxonomyTerm[] = []) => {
  return new Map<number, WordPressTaxonomyTerm>(
    terms.map((term) => [term.id, term])
  );
};

const resolveCategoryNames = (
  categoryIds: number[],
  categoryMap: Map<number, WordPressTaxonomyTerm>
) => {
  return categoryIds
    .map((categoryId) => categoryMap.get(categoryId)?.name)
    .filter((categoryName): categoryName is string => Boolean(categoryName));
};

const resolveTagNames = (
  tagIds: number[],
  tagMap?: Map<number, WordPressTaxonomyTerm>
) => {
  if (!tagMap) {
    return [];
  }

  return tagIds
    .map((tagId) => tagMap.get(tagId)?.name)
    .filter((tagName): tagName is string => Boolean(tagName));
};

const resolvePrimaryCategory = (categoryNames: string[], fallback: string) => {
  return (
    categoryNames.find((categoryName) => !SPECIAL_CATEGORY_NAMES.has(categoryName)) ||
    categoryNames[0] ||
    fallback
  );
};

export const hydrateArticle = (
  article: Article,
  categoryMap: Map<number, WordPressTaxonomyTerm>,
  tagMap?: Map<number, WordPressTaxonomyTerm>
): Article => {
  const allCategories = resolveCategoryNames(article.categoryIds, categoryMap);
  const tagNames = resolveTagNames(article.tagIds, tagMap);

  return {
    ...article,
    category: resolvePrimaryCategory(allCategories, article.category),
    allCategories: allCategories.length > 0 ? allCategories : article.allCategories,
    tags: tagNames.length > 0 ? tagNames : article.tags,
    tagNames: tagNames.length > 0 ? tagNames : article.tagNames,
  };
};

export const hydrateArticles = (
  articles: Article[],
  categoryMap: Map<number, WordPressTaxonomyTerm>,
  tagMap?: Map<number, WordPressTaxonomyTerm>
) => {
  return articles.map((article) => hydrateArticle(article, categoryMap, tagMap));
};
