import React from "react";
import { DefaultArticleCard } from "./article/DefaultArticleCard";
import { HorizontalArticleCard } from "./article/HorizontalArticleCard";
import { HighlightedArticleCard } from "./article/HighlightedArticleCard";
import { RegularBlogCard } from "./article/RegularBlogCard";
import { trackArticleClick } from "@/utils/analytics";

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
  horizontal = false,
}) => {
  // Original design for homepage
  if (variant === "default") {
    return <DefaultArticleCard article={article} />;
  }

  // Horizontal layout for category sections
  if (horizontal) {
    return <HorizontalArticleCard article={article} />;
  }

  // Highlighted card (for first trending article)
  if (highlighted) {
    return <HighlightedArticleCard article={article} />;
  }

  // Regular blog design with compact options
  return <RegularBlogCard article={article} compact={compact} />;
};
