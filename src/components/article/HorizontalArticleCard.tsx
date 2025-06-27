import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { getPreviewText } from "./articleUtils";

interface HorizontalArticleCardProps {
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
    tags?: string[]; // Added tags property as an optional string array
  };
}

export const HorizontalArticleCard: React.FC<HorizontalArticleCardProps> = ({
  article,
}) => {
  return (
    <Link
      to={`/article/${article.id}`}
      state={{ article }}
      className="group cursor-pointer block"
    >
      <div className="bg-gray-700/50 rounded-lg overflow-hidden border border-gray-600 hover:border-blue-500 transition-all duration-300 hover:shadow-md hover:shadow-blue-500/10 flex h-36">
        {/* Image - 30% */}
        <div className="w-[30%] bg-gradient-to-br from-blue-600 to-purple-600 relative overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content - 70% */}
        <div className="w-[70%] p-4 flex flex-col justify-between">
          <div className="flex-1">
            <h4 className="text-gray-100 font-medium text-sm mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors leading-tight">
              {article.title}
            </h4>
            <p className="text-gray-400 text-xs line-clamp-3 leading-relaxed">
              {getPreviewText(article, "blog", false, false, true)}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
            <Badge className="bg-black/30 text-white text-xs px-2 py-1 h-5">
              {article.tags[0]}
            </Badge>
            <span className="text-xs">{article.readTime}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
