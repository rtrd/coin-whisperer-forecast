
import React from "react";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";

interface ArticleContentProps {
  content: string;
  tags: string[];
}

export const ArticleContent: React.FC<ArticleContentProps> = ({ content, tags }) => {
  return (
    <CardContent className="p-4 md:p-8">
      <div
        className="prose prose-invert max-w-none text-gray-200 
        prose-headings:text-shadow-lg prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-6 prose-h1:text-white
        prose-h2:text-2xl prose-h2:font-semibold prose-h2:mb-4 prose-h2:mt-8 prose-h2:text-white
        prose-h3:text-xl prose-h3:font-medium prose-h3:mb-3 prose-h3:mt-6 prose-h3:text-gray-100
        prose-h4:text-lg prose-h4:font-medium prose-h4:mb-2 prose-h4:mt-4 prose-h4:text-gray-200
        prose-p:mb-8 prose-p:leading-relaxed prose-p:text-gray-200
        prose-ul:mb-6 prose-li:mb-2"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Article Tags */}
      <div className="border-t border-gray-600 pt-6 mt-8">
        <div className="flex items-center gap-2 mb-3">
          <Tag className="h-4 w-4 text-blue-400" />
          <span className="text-white font-medium">Tags:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag: string, index: number) => (
            <Badge
              key={index}
              variant="outline" 
              className="bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600/50"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </CardContent>
  );
};
