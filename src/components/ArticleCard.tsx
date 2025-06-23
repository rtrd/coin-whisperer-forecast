
import React from "react";
import { Link } from "react-router-dom";
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
    content?: string;
    tags?: string[];
  };
  compact?: boolean;
  variant?: "default" | "blog";
  extraCompact?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ 
  article, 
  compact = false, 
  variant = "default",
  extraCompact = false
}) => {
  // Extract first 3 lines of text from excerpt or content (only for blog variant)
  const getPreviewText = () => {
    if (variant === "default") return article.excerpt;
    
    const text = article.excerpt || article.content || "";
    const cleanText = text.replace(/<[^>]+>/g, "").trim();
    const words = cleanText.split(" ");
    const wordLimit = extraCompact ? 8 : compact ? 12 : 20;
    return words.slice(0, wordLimit).join(" ") + (words.length > wordLimit ? "..." : "");
  };

  // Original design for homepage
  if (variant === "default") {
    return (
      <Link
        to={`/article/${article.id}`}
        state={{ article }}
        className="group cursor-pointer block"
      >
        <div className="bg-gray-700/50 rounded-lg overflow-hidden border border-gray-600 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
          <div className="aspect-video bg-gradient-to-br from-blue-600 to-purple-600 relative overflow-hidden">
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

          <div className="p-4">
            <h3 className="text-gray-100 font-semibold text-sm mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
              {article.title}
            </h3>

            <p className="text-gray-300 text-xs mb-3 line-clamp-2">
              {article.excerpt}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span className="truncate">{article.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(article.date).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs text-blue-400 mt-1">
              <Clock className="h-3 w-3" />
              <span>{article.readTime}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Blog design with much smaller cards
  const cardClasses = extraCompact 
    ? "bg-gray-700/50 rounded-md overflow-hidden border border-gray-600 hover:border-blue-500 transition-all duration-300 hover:shadow-sm h-full flex flex-col"
    : compact 
    ? "bg-gray-700/50 rounded-lg overflow-hidden border border-gray-600 hover:border-blue-500 transition-all duration-300 hover:shadow-md hover:shadow-blue-500/10 h-full flex flex-col max-w-xs"
    : "bg-gray-700/50 rounded-lg overflow-hidden border border-gray-600 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 h-full flex flex-col max-w-sm";

  const aspectRatio = extraCompact ? "aspect-[2/1]" : compact ? "aspect-[3/2]" : "aspect-[3/2]";
  const padding = extraCompact ? "p-2" : compact ? "p-2" : "p-3";
  const titleSize = extraCompact ? "text-xs" : compact ? "text-xs" : "text-sm";
  const textSize = extraCompact ? "text-xs" : "text-xs";
  const metaSize = extraCompact ? "text-xs" : "text-xs";

  return (
    <Link
      to={`/article/${article.id}`}
      state={{ article }}
      className="group cursor-pointer block h-full"
    >
      <div className={cardClasses}>
        <div className={`${aspectRatio} bg-gradient-to-br from-blue-600 to-purple-600 relative overflow-hidden`}>
          <img 
            src={article.image} 
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className={`absolute ${extraCompact ? 'bottom-0.5 left-0.5' : 'bottom-1 left-1'}`}>
            <Badge className={`bg-black/50 text-white ${extraCompact ? 'text-xs px-1 py-0 text-xs' : 'text-xs px-1 py-0'}`}>
              {article.category}
            </Badge>
          </div>
        </div>

        <div className={`${padding} flex-1 flex flex-col`}>
          <h3 className={`text-gray-100 font-semibold ${titleSize} ${extraCompact ? 'mb-1 line-clamp-1' : 'mb-1 line-clamp-2'} group-hover:text-blue-400 transition-colors`}>
            {article.title}
          </h3>

          <p className={`text-gray-300 ${textSize} ${extraCompact ? 'mb-1' : 'mb-2'} flex-1 leading-tight line-clamp-2`}>
            {getPreviewText()}
          </p>

          <div className="mt-auto space-y-0.5">
            <div className={`flex items-center justify-between ${metaSize} text-gray-400`}>
              <div className="flex items-center gap-0.5">
                <User className={extraCompact ? "h-2 w-2" : "h-2.5 w-2.5"} />
                <span className="truncate text-xs">{article.author}</span>
              </div>
              <div className="flex items-center gap-0.5">
                <Calendar className={extraCompact ? "h-2 w-2" : "h-2.5 w-2.5"} />
                <span className="text-xs">{new Date(article.date).toLocaleDateString()}</span>
              </div>
            </div>

            <div className={`flex items-center gap-0.5 ${metaSize} text-blue-400`}>
              <Clock className={extraCompact ? "h-2 w-2" : "h-2.5 w-2.5"} />
              <span className="text-xs">{article.readTime}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
