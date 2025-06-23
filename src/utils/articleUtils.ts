
export const formatArticleForDisplay = (article: any) => {
  const tagList = article.tagname
    ? article.tagname.split(",").map((tag: string) => tag.trim()).filter(Boolean)
    : [];

  return {
    id: article.id,
    title: article.title,
    content: article.content,
    author: article.author || "Unknown",
    date: article.date,
    category: article.category || "General",
    readTime: article.readTime || "4 min read",
    image: article.image || "https://via.placeholder.com/800x400",
    tags: tagList.length > 0 ? tagList : ["crypto", "analysis", "market"], // fallback if no tags
  };
};

export const getRelatedArticles = (currentArticle: any, allArticles: any[]) => {
  if (!currentArticle) return [];

  const currentTags = Array.isArray(currentArticle.tags)
    ? currentArticle.tags.map((t: string) => t.toLowerCase().trim())
    : [];

  return allArticles
    .filter((a) => a.id !== currentArticle.id) // Exclude self
    .map((a) => {
      const articleTags = Array.isArray(a.tags)
        ? a.tags.map((t: string) => t.toLowerCase().trim())
        : [];

      const matchCount = currentTags.filter((tag) => articleTags.includes(tag)).length;

      return {
        ...a,
        matchCount,
      };
    })
    .filter((a) => a.matchCount > 0) // Only keep related ones
    .sort((a, b) => b.matchCount - a.matchCount) // Sort by relevance
    .slice(0, 4); // Limit to 4
};


