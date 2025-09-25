import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowRight } from "lucide-react";
import { ArticleCard } from "./ArticleCard";
import { getWordPressPost } from "../../utils/api";
import { decodeHtmlEntities } from "@/utils/htmlUtils";

interface WordPressIntegrationOptimizedProps {
  enabled?: boolean;
}

const WordPressIntegrationOptimized: React.FC<WordPressIntegrationOptimizedProps> = ({ 
  enabled = true 
}) => {
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const transformArticles = (posts: any[]) => {
    return posts.map((post) => {
      const title = decodeHtmlEntities(post.title?.rendered || "No Title");
      const excerpt = decodeHtmlEntities(post.excerpt?.rendered?.replace(/<[^>]+>/g, "") || "");
      const date = new Date(post.date).toISOString().split("T")[0];
      const author = post._embedded?.author?.[0]?.name || "Unknown";
      const image =
        post.jetpack_featured_media_url ||
        post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
        "https://via.placeholder.com/300";
      const url = post.link;
      const content = decodeHtmlEntities(post.content?.rendered || ""); // full HTML content
      const tagname = post.tagNames?.filter((t: string) => t)?.join(", ") || "";

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
        tagname,
      };
    });
  };

  useEffect(() => {
    if (!enabled) return;
    
    fetchArticles();
  }, [enabled]);

  const fetchArticles = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const articleData = await getWordPressPost();

      if (Array.isArray(articleData)) {
        const formattedArticles = transformArticles(articleData).slice(0, 4);
        setArticles(formattedArticles);
      } else {
        console.error("Fetched article data is not an array:", articleData);
      }
    } catch (error) {
      console.error("Failed to fetch articles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewAllClick = () => {
    window.location.href = '/blog';
  };

  return (
    <Card className="mb-8 bg-gray-800/50 border-gray-700 shadow-2xl hover:bg-gray-800/70 transition-colors">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <ExternalLink className="h-5 w-5 text-blue-400" />
            <h2>Latest Crypto News & Analysis</h2>
            <Badge className="bg-blue-600">Live Feed</Badge>
          </CardTitle>
          <Button 
            variant="outline"
            className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            onClick={handleViewAllClick}
          >
            View All Articles
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} compact={true} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WordPressIntegrationOptimized;