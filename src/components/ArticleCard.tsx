
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Clock } from "lucide-react";

interface ArticleCardProps {
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
  };
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <Link to={`/article/${article.id}`} className="group cursor-pointer block">
      <div className="bg-gray-700/50 rounded-lg overflow-hidden border border-gray-600 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
        <div className="aspect-video bg-gradient-to-br from-blue-600 to-purple-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute bottom-2 left-2">
            <Badge className="bg-black/50 text-white text-xs">
              {article.category}
            </Badge>
          </div>
        </div>
        
        <div className="p-3">
          <h3 className="text-gray-100 font-semibold text-sm mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
            {article.title}
          </h3>
          
          <p className="text-gray-300 text-xs mb-3 line-clamp-2">
            {article.excerpt}
          </p>
          
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(article.date).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="mt-2 flex items-center gap-1 text-xs text-blue-400">
            <Clock className="h-3 w-3" />
            <span>{article.readTime}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
