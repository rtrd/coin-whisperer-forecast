
import React from "react";
import { Star } from "lucide-react";
import { FeaturedArticle } from "@/components/FeaturedArticle";

interface BlogFeaturedSectionProps {
  featuredArticle: any;
}

export const BlogFeaturedSection: React.FC<BlogFeaturedSectionProps> = ({ featuredArticle }) => {
  if (!featuredArticle) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <Star className="h-6 w-6 text-yellow-400" />
        <h2 className="text-2xl font-bold text-white">Featured Article</h2>
      </div>
      <FeaturedArticle article={featuredArticle} />
    </div>
  );
};
