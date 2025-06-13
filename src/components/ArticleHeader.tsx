
import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  User,
  Clock,
  Share2,
  BookmarkPlus,
} from "lucide-react";

interface ArticleHeaderProps {
  article: {
    title: string;
    category: string;
    image: string;
    author: string;
    date: string;
    readTime: string;
  };
}

export const ArticleHeader: React.FC<ArticleHeaderProps> = ({ article }) => {
  return (
    <div
      className="relative bg-cover bg-center h-80 article_image_custom rounded-t-lg"
      style={{ backgroundImage: `url(${article.image})` }}
    >
      <div className="absolute inset-0 bg-black/70 rounded-t-lg"></div>
      <CardHeader className="relative z-10 h-full flex flex-col justify-end">
        <div className="flex items-center gap-2 mb-4">
          <Badge className="bg-blue-600">{article.category}</Badge>
        </div>
        <CardTitle
          className="text-3xl md:text-4xl text-white mb-4"
          style={{ textShadow: "0 0 10px rgba(0, 0, 0, 0.3)" }}
        >
          {article.title}
        </CardTitle>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-gray-200 gap-4">
          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="text-sm md:text-base">
                {article.author}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm md:text-base">
                {new Date(article.date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm md:text-base">
                {article.readTime}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-gray-700/80 border-gray-600 text-white hover:bg-gray-600"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-gray-700/80 border-gray-600 text-white hover:bg-gray-600"
            >
              <BookmarkPlus className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </CardHeader>
    </div>
  );
};
