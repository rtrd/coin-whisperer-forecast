
export const formatArticleForDisplay = (article: any) => {
  const tagList: string[] = [];

  // Case 1: WordPress tagNames array (prioritize this)
  if (Array.isArray(article.tagNames)) {
    tagList.push(
      ...article.tagNames
        .filter((tag: any) => typeof tag === "string" && tag.trim())
        .map((tag: string) => tag.trim())
    );
  }
  // Case 2: comma-separated `tagname`
  else if (typeof article.tagname === "string") {
    tagList.push(
      ...article.tagname
        .split(",")
        .map((tag: string) => tag.trim())
        .filter(Boolean)
    );
  }
  // Case 3: `tags` is already an array
  else if (Array.isArray(article.tags)) {
    tagList.push(
      ...article.tags
        .filter((tag: any) => typeof tag === "string")
        .map((tag: string) => tag.trim())
    );
  }

  // Remove duplicates but preserve original case for featured detection
  const uniqueTags = [...new Set(tagList.filter(Boolean))];

  return {
    id: article.id,
    title: article.title,
    content: article.content,
    author: article.author || "Unknown",
    date: article.date,
    category: article.category || "General",
    readTime: article.readTime || "4 min read",
    image: article.image || "https://via.placeholder.com/800x400",
    tags: uniqueTags.length > 0 ? uniqueTags : ["crypto", "analysis", "market"], // fallback
  };
};

export const getFeaturedArticle = (articles: any[]) => {
  console.log("Finding featured article from", articles.length, "articles");
  
  // Look for articles with "featured" tag (case-insensitive)
  const featuredArticles = articles.filter(article => {
    const hasFeaturedTag = Array.isArray(article.tags) && 
      article.tags.some((tag: string) => 
        typeof tag === 'string' && tag.toLowerCase().includes('featured')
      );
    
    if (hasFeaturedTag) {
      console.log("Found featured article:", article.title, "with tags:", article.tags);
    }
    
    return hasFeaturedTag;
  });

  // If featured articles exist, return the most recent one
  if (featuredArticles.length > 0) {
    const selected = featuredArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    console.log("Selected featured article:", selected.title);
    return selected;
  }

  console.log("No featured articles found, using first article");
  // Fallback to first article if no featured articles
  return articles[0] || null;
};

export const getRelatedArticles = (currentArticle: any, allArticles: any[]) => {
  if (!currentArticle || !Array.isArray(currentArticle.tags)) return [];

  // Normalize current article tags
  const currentTags = currentArticle.tags
    .filter((t: any) => typeof t === 'string' && t.trim() !== '')
    .map((t: string) => t.toLowerCase().trim());

  return allArticles
    .filter((a) => a.id !== currentArticle.id)
    .map((a) => {
      const articleTags = Array.isArray(a.tagNames)
        ? a.tagNames
            .filter((t: any) => typeof t === 'string' && t.trim() !== '')
            .map((t: string) => t.toLowerCase().trim())
        : [];

      // ✅ Get only tags that match current article
      const matchedTags = articleTags.filter((tag) => currentTags.includes(tag));
      console.log("matchedTags", matchedTags);  

      return {
        ...a,
        tags: matchedTags,       // ⬅️ only keep matched tags here
        matchCount: matchedTags.length,
      };
    })
    .filter((a) => a.matchCount > 0) // ⬅️ keep only those with at least one matched tag
    .sort((a, b) => b.matchCount - a.matchCount) // optional: sort by relevance
    .slice(0, 4); 
};





