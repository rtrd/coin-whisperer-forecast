
export const formatArticleForDisplay = (article: any) => {
  // Extract WordPress tags from the API response
  const wordPressTags = article._embedded?.['wp:term']?.[1]?.map((tag: any) => tag.name) || [];
  
  return {
    id: article.id,
    title: article.title,
    content: article.content,
    author: article.author || "Unknown",
    date: article.date,
    category: article.category || "General",
    readTime: article.readTime || "4 min read",
    image: article.image || "https://via.placeholder.com/800x400",
    tags: wordPressTags.length > 0 ? wordPressTags : ["crypto", "analysis", "market"], // fallback to default tags if no WordPress tags
  };
};

export const getRelatedArticles = (currentArticle: any, allArticles: any[]) => {
  if (!currentArticle) return [];
  
  const currentTags = currentArticle.tags || [];
  return allArticles
    .filter((a) => a.id !== currentArticle.id)
    .filter((a) => {
      const articleTags = a.tags || [];
      return currentTags.some((tag: string) => articleTags.includes(tag));
    })
    .slice(0, 4);
};
