
import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar, User, Clock } from "lucide-react";

interface FeaturedArticleProps {
  article: {
    id: number;
    title: string;
    excerpt: string;
    author: string;
    date: string;
    category: string;
    readTime: string;
    image: string;
    content?: string;
    tags?: string[];
  };
}

export const FeaturedArticle: React.FC<FeaturedArticleProps> = ({ article }) => {
  // Get preview text from excerpt or content
  const getPreviewText = () => {
    const text = article.excerpt || article.content || "";
    const cleanText = text.replace(/<[^>]+>/g, "").trim();
    const words = cleanText.split(" ");
    const wordLimit = 40;
    return words.slice(0, wordLimit).join(" ") + (words.length > wordLimit ? "..." : "");
  };

  return (
    <Link to={`/article/${article.id}`} state={{ article }} className="block">
      <Card className="bg-gray-800/50 border-gray-700 overflow-hidden hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="aspect-video lg:aspect-auto relative overflow-hidden">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <Badge className="bg-yellow-600 text-black font-bold">
                Featured
              </Badge>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 flex flex-col justify-center">
            <div className="mb-4">
              <Badge className="bg-blue-600 mb-3">
                {article.category}
              </Badge>
              <h2 className="text-3xl font-bold text-white mb-4 leading-tight hover:text-blue-400 transition-colors">
                {article.title}
              </h2>
            </div>

            <p className="text-gray-300 text-lg mb-6 line-clamp-4 leading-relaxed">
              {getPreviewText()}
            </p>

            <div className="flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(article.date).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-blue-400">
                <Clock className="h-4 w-4" />
                <span>{article.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};
