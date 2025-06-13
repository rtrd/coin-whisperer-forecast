
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RelatedArticle {
  id: number;
  title: string;
  author: string;
  readTime: string;
  image: string;
  category: string;
  tags?: string[];
}

interface RelatedArticlesProps {
  articles: RelatedArticle[];
}

export const RelatedArticles: React.FC<RelatedArticlesProps> = ({ articles }) => {
  if (articles.length === 0) return null;

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle
          className="text-white"
          style={{ textShadow: "0 0 10px rgba(0, 0, 0, 0.3)" }}
        >
          Related Articles
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((relatedArticle) => (
            <Link
              key={relatedArticle.id}
              to={`/article/${relatedArticle.id}`}
              state={{ article: relatedArticle }}
              className="block group"
            >
              <div className="bg-gray-700/50 rounded-lg overflow-hidden hover:bg-gray-700/70 transition-colors">
                <div
                  className="aspect-video bg-cover bg-center rounded-t-lg"
                  style={{
                    backgroundImage: `url(${relatedArticle.image})`,
                  }}
                >
                  <div className="h-full bg-gradient-to-t from-black/60 to-transparent flex items-end p-3 rounded-t-lg">
                    <Badge className="bg-blue-600 text-xs">
                      {relatedArticle.category}
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold mb-2 text-shadow-lg group-hover:text-blue-400 transition-colors line-clamp-2">
                    {relatedArticle.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span>{relatedArticle.author}</span>
                    <span>{relatedArticle.readTime}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {relatedArticle.tags?.slice(0, 2).map((tag: string, index: number) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs bg-gray-600/50 border-gray-500 text-gray-300"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
