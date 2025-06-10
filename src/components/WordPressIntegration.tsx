import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { ArticleCard } from "./ArticleCard";
import { getWordPressPost } from "../../utils/api";

const WordPressIntegration = () => {
  const [articles, setArticles] = useState<any[]>([]);

  const transformArticles = (posts: any[]) => {
    return posts.map((post) => {
      const title = post.title?.rendered || "No Title";
      const excerpt = post.excerpt?.rendered?.replace(/<[^>]+>/g, "") || "";
      const date = new Date(post.date).toISOString().split("T")[0];
      const author = post._embedded?.author?.[0]?.name || "Unknown";
      const image =
        post.jetpack_featured_media_url ||
        post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
        "https://via.placeholder.com/300";
      const url = post.link;
      const content = post.content?.rendered || ""; // full HTML content

      return {
        id: post.id,
        title,
        excerpt,
        author,
        date,
        category: "Blog",
        readTime: "4 min read",
        image,
        url,
        content,
      };
    });
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    const articleData = await getWordPressPost();

    if (Array.isArray(articleData)) {
      const formattedArticles = transformArticles(articleData).slice(0, 6);
      setArticles(formattedArticles);
    } else {
      console.error("Fetched article data is not an array:", articleData);
    }
  };

  return (
    <Card className="mb-8 bg-gray-800/50 border-gray-700 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <ExternalLink className="h-5 w-5 text-blue-400" />
          Latest Crypto News & Analysis
          <Badge className="bg-blue-600">Live Feed</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WordPressIntegration;
