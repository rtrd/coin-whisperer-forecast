
import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Clock } from "lucide-react";
import { getPreviewText } from "./articleUtils";

interface HighlightedArticleCardProps {
  article: {
    id: number;
    title: string;
    excerpt: string;
    author: string;
    date: string;
    category: string;
    readTime: string;
    image: string;
    url: string;
    content?: string;
  };
}

export const HighlightedArticleCard: React.FC<HighlightedArticleCardProps> = ({ article }) => {
  return (
    <Link
      to={`/article/${article.id}`}
      state={{ article }}
      className="group cursor-pointer block h-full"
    >
      <div className="bg-gray-700/50 rounded-lg overflow-hidden border-2 border-yellow-500/50 hover:border-yellow-400 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20 h-full flex flex-col">
        <div className="aspect-[4/3] bg-gradient-to-br from-blue-600 to-purple-600 relative overflow-hidden">
          <img 
            src={article.image} 
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2">
            <Badge className="bg-black/50 text-white text-xs">
              {article.category}
            </Badge>
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-gray-100 font-bold text-lg mb-4 line-clamp-2 group-hover:text-yellow-400 transition-colors leading-tight">
            {article.title}
          </h3>

          <p className="text-gray-300 text-sm mb-4 flex-1 leading-relaxed line-clamp-6">
            {getPreviewText(article, "blog", false, true, false)}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-400 mt-auto">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span className="text-xs">{article.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span className="text-xs">{new Date(article.date).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-yellow-400">
              <Clock className="h-3 w-3" />
              <span className="text-xs">{article.readTime}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
