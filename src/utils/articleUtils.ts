
export const formatArticleForDisplay = (article: any) => {
  console.log("🔍 formatArticleForDisplay - Processing article:", article.title);
  console.log("  - Input tagNames:", article.tagNames);
  console.log("  - Input tagname:", article.tagname);
  console.log("  - Input tags:", article.tags);
  
  const tagList: string[] = [];

  // Case 1: WordPress tagNames array (prioritize this)
  if (Array.isArray(article.tagNames)) {
    console.log("  - Using WordPress tagNames array");
    tagList.push(
      ...article.tagNames
        .filter((tag: any) => typeof tag === "string" && tag.trim())
        .map((tag: string) => tag.trim())
    );
  }
  // Case 2: comma-separated `tagname`
  else if (typeof article.tagname === "string") {
    console.log("  - Using comma-separated tagname string");
    tagList.push(
      ...article.tagname
        .split(",")
        .map((tag: string) => tag.trim())
        .filter(Boolean)
    );
  }
  // Case 3: `tags` is already an array
  else if (Array.isArray(article.tags)) {
    console.log("  - Using existing tags array");
    tagList.push(
      ...article.tags
        .filter((tag: any) => typeof tag === "string")
        .map((tag: string) => tag.trim())
    );
  }

  // Remove duplicates but preserve original case for featured detection
  const uniqueTags = [...new Set(tagList.filter(Boolean))];
  console.log("  - Final processed tags:", uniqueTags);

  const formattedArticle = {
    id: article.id,
    title: article.title,
    content: article.content,
    author: article.author || "Unknown",
    date: article.date,
    category: article.category || "General",
    allCategories: article.allCategories || [], // Store all categories
    readTime: article.readTime || "4 min read",
    image: article.image || "https://via.placeholder.com/800x400",
    tags: uniqueTags.length > 0 ? uniqueTags : ["crypto", "analysis", "market"], // fallback
  };
  
  console.log("  - Article formatted with final tags:", formattedArticle.tags);
  return formattedArticle;
};

export const getFeaturedArticle = (articles: any[]) => {
  console.log("🎯 FEATURED ARTICLE DETECTION");
  console.log("📊 Finding featured article from", articles.length, "articles");
  
  // Debug: Log all articles and their categories
  articles.forEach((article, index) => {
    console.log(`📄 Article ${index + 1}: "${article.title}"`);
    console.log(`   Primary Category: ${article.category}`);
    console.log(`   All Categories: ${JSON.stringify(article.allCategories)}`);
    console.log(`   Date: ${article.date}`);
  });
  
  // Look for articles with "Featured" category (exact match with capital F)
  // Check both primary category and allCategories array
  console.log("🔍 Looking for articles with 'Featured' category (exact match)...");
  const featuredArticles = articles.filter(article => {
    const isPrimaryFeatured = article.category === 'Featured';
    const isInAllCategories = article.allCategories?.includes('Featured');
    const hasFeaturedCategory = isPrimaryFeatured || isInAllCategories;
    
    if (hasFeaturedCategory) {
      console.log("✅ Found featured article:", article.title);
      console.log("   - Primary category:", article.category);
      console.log("   - All categories:", article.allCategories);
      console.log("   - Featured via primary:", isPrimaryFeatured);
      console.log("   - Featured via allCategories:", isInAllCategories);
    }
    
    return hasFeaturedCategory;
  });

  console.log(`📊 Found ${featuredArticles.length} articles in 'Featured' category`);

  // If no exact match, try case-insensitive search
  if (featuredArticles.length === 0) {
    console.log("🔍 No exact 'Featured' match, trying case-insensitive search...");
    const caseInsensitiveFeatured = articles.filter(article => {
      const isPrimaryFeatured = typeof article.category === 'string' && 
        article.category.toLowerCase() === 'featured';
      const isInAllCategories = article.allCategories?.some((cat: string) => 
        cat?.toLowerCase() === 'featured'
      );
      const hasFeaturedCategory = isPrimaryFeatured || isInAllCategories;
      
      if (hasFeaturedCategory) {
        console.log("⚠️ Found case-insensitive featured article:", article.title);
        console.log("   - Primary category:", article.category);
        console.log("   - All categories:", article.allCategories);
        console.log("   - Featured via primary:", isPrimaryFeatured);
        console.log("   - Featured via allCategories:", isInAllCategories);
      }
      
      return hasFeaturedCategory;
    });
    
    if (caseInsensitiveFeatured.length > 0) {
      const selected = caseInsensitiveFeatured.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      console.log("✅ Selected case-insensitive featured article:", selected.title);
      return selected;
    }
  }

  // If featured articles exist, return the most recent one
  if (featuredArticles.length > 0) {
    const selected = featuredArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    console.log("✅ Selected featured article:", selected.title);
    return selected;
  }

  console.log("❌ No featured articles found, using first article as fallback");
  const fallback = articles[0] || null;
  if (fallback) {
    console.log("📄 Fallback article:", fallback.title, "with category:", fallback.category);
  }
  return fallback;
};

export const getTrendingArticles = (articles: any[]): any[] => {
  console.log("🔥 TRENDING ARTICLE DETECTION");
  console.log("📊 Finding trending articles from", articles.length, "articles");
  
  if (!articles || articles.length === 0) {
    return [];
  }

  // Debug: Log all articles and their categories
  articles.forEach((article, index) => {
    console.log(`📄 Article ${index + 1}: "${article.title}"`);
    console.log(`   Primary Category: ${article.category}`);
    console.log(`   All Categories: ${JSON.stringify(article.allCategories)}`);
  });

  // First try exact match for "Trending" category
  let trendingArticles = articles.filter(article => {
    const categories = article.allCategories || [article.category];
    const hasTrending = categories.some((category: string) => category === "Trending");
    
    if (hasTrending) {
      console.log("✅ Found trending article (exact):", article.title);
      console.log("   - Categories:", categories);
    }
    
    return hasTrending;
  });

  console.log(`📊 Found ${trendingArticles.length} articles with exact 'Trending' match`);

  // If no exact match, try case-insensitive search
  if (trendingArticles.length === 0) {
    console.log("🔍 No exact 'Trending' match, trying case-insensitive search...");
    trendingArticles = articles.filter(article => {
      const categories = article.allCategories || [article.category];
      const hasTrending = categories.some((category: string) => 
        category?.toLowerCase() === "trending"
      );
      
      if (hasTrending) {
        console.log("⚠️ Found trending article (case-insensitive):", article.title);
        console.log("   - Categories:", categories);
      }
      
      return hasTrending;
    });
  }

  console.log(`📊 Total trending articles found: ${trendingArticles.length}`);

  // Sort by date (newest first) if multiple trending articles
  if (trendingArticles.length > 1) {
    trendingArticles.sort((a, b) => {
      const dateA = new Date(a.date || 0);
      const dateB = new Date(b.date || 0);
      return dateB.getTime() - dateA.getTime();
    });
    console.log("📅 Sorted trending articles by date");
  }

  return trendingArticles;
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





