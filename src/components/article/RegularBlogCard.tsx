
import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Clock } from "lucide-react";
import { getPreviewText } from "./articleUtils";
import { trackArticleClick } from "@/utils/analytics";

interface RegularBlogCardProps {
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
  compact?: boolean;
}

export const RegularBlogCard: React.FC<RegularBlogCardProps> = ({ 
  article, 
  compact = false 
}) => {
  const handleClick = () => {
    trackArticleClick(article.title, 0);
  };

  const cardClasses = compact 
    ? "bg-gray-700/50 rounded-lg overflow-hidden border border-gray-600 hover:border-blue-500 transition-all duration-300 hover:shadow-md hover:shadow-blue-500/10 h-full flex flex-col"
    : "bg-gray-700/50 rounded-lg overflow-hidden border border-gray-600 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 h-full flex flex-col";

  const aspectRatio = compact ? "aspect-[3/2]" : "aspect-[4/3]";
  const padding = compact ? "p-2" : "p-3";
  const titleSize = compact ? "text-xs" : "text-sm";
  const textSize = "text-xs";
  const metaSize = "text-xs";

  return (
    <Link
      to={`/article/${article.id}`}
      state={{ article }}
      className="group cursor-pointer block h-full"
      onClick={handleClick}
    >
      <div className={cardClasses}>
        <div className={`${aspectRatio} bg-gradient-to-br from-blue-600 to-purple-600 relative overflow-hidden`}>
          <img 
            src={article.image} 
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-1 left-1">
            <Badge className={`bg-black/50 text-white text-xs px-1 py-0`}>
              {article.category}
            </Badge>
          </div>
        </div>

        <div className={`${padding} flex-1 flex flex-col`}>
          <h3 className={`text-gray-100 font-semibold ${titleSize} mb-1 line-clamp-2 group-hover:text-blue-400 transition-colors`}>
            {article.title}
          </h3>

          <p className={`text-gray-300 ${textSize} mb-2 flex-1 leading-relaxed line-clamp-2`}>
            {getPreviewText(article, "blog", compact, false, false)}
          </p>

          <div className="mt-auto space-y-1">
            <div className={`flex items-center justify-between ${metaSize} text-gray-400`}>
              <div className="flex items-center gap-1">
                <User className="h-2.5 w-2.5" />
                <span className="truncate">{article.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-2.5 w-2.5" />
                <span>{new Date(article.date).toLocaleDateString()}</span>
              </div>
            </div>

            <div className={`flex items-center gap-1 ${metaSize} text-blue-400`}>
              <Clock className="h-2.5 w-2.5" />
              <span>{article.readTime}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
