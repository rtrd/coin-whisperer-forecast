
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
  highlighted?: boolean;
  horizontal?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ 
  article, 
  compact = false, 
  variant = "default",
  highlighted = false,
  horizontal = false
}) => {
  // Extract first 3 lines of text from excerpt or content (only for blog variant)
  const getPreviewText = () => {
    if (variant === "default") return article.excerpt;
    
    const text = article.excerpt || article.content || "";
    const cleanText = text.replace(/<[^>]+>/g, "").trim();
    const words = cleanText.split(" ");
    let wordLimit = 25;
    
    if (compact) wordLimit = 15;
    if (highlighted) wordLimit = 35;
    if (horizontal) wordLimit = 12;
    
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

  // Horizontal layout for category sections
  if (horizontal) {
    return (
      <Link
        to={`/article/${article.id}`}
        state={{ article }}
        className="group cursor-pointer block"
      >
        <div className="bg-gray-700/50 rounded-lg overflow-hidden border border-gray-600 hover:border-blue-500 transition-all duration-300 hover:shadow-md hover:shadow-blue-500/10 flex h-28">
          {/* Image - 30% */}
          <div className="w-[30%] bg-gradient-to-br from-blue-600 to-purple-600 relative overflow-hidden">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content - 70% */}
          <div className="w-[70%] p-3 flex flex-col justify-between">
            <div className="flex-1">
              <h4 className="text-gray-100 font-medium text-sm mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors leading-tight">
                {article.title}
              </h4>
              <p className="text-gray-400 text-xs line-clamp-2 leading-tight">
                {getPreviewText()}
              </p>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
              <Badge className="bg-black/30 text-white text-xs px-1 py-0 h-4">
                {article.category}
              </Badge>
              <span className="text-xs">{article.readTime}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Highlighted card (for first trending article) - made smaller
  if (highlighted) {
    return (
      <Link
        to={`/article/${article.id}`}
        state={{ article }}
        className="group cursor-pointer block"
      >
        <div className="bg-gray-700/50 rounded-lg overflow-hidden border-2 border-yellow-500/50 hover:border-yellow-400 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20">
          <div className="aspect-[4/3] bg-gradient-to-br from-blue-600 to-purple-600 relative overflow-hidden">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2">
              <Badge className="bg-yellow-600 text-black font-bold text-xs">
                Trending #1
              </Badge>
            </div>
            <div className="absolute bottom-2 left-2">
              <Badge className="bg-black/50 text-white text-xs">
                {article.category}
              </Badge>
            </div>
          </div>

          <div className="p-3">
            <h3 className="text-gray-100 font-bold text-sm mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors">
              {article.title}
            </h3>

            <p className="text-gray-300 text-xs mb-3 line-clamp-2 leading-relaxed">
              {getPreviewText()}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-400">
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
  }

  // Regular blog design with compact options
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
            {getPreviewText()}
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
