
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdBanner } from "@/components/AdBanner";
import { ArticleCard } from "@/components/ArticleCard";
import { DynamicTokenAnalysis } from "@/components/DynamicTokenAnalysis";
import { TokenDataService } from "@/services/tokenDataService";
import { 
  ExternalLink, 
  ArrowRight, 
  FileText,
  BarChart3,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { getWordPressPost } from "../../../utils/api";
import { trackArticleClick } from '@/utils/analytics';

interface TokenSidebarProps {
  currentTokenId: string;
  selectedCrypto: string;
  currentPrice: number;
  priceChange: number;
  cryptoOptions: any[];
}

export function TokenSidebar({ currentTokenId, selectedCrypto, currentPrice, priceChange, cryptoOptions }: TokenSidebarProps) {
  const [articles, setArticles] = useState<any[]>([]);
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchArticles();
  }, []);

  // Auto-rotate articles every 5 seconds
  useEffect(() => {
    if (articles.length > 1) {
      const interval = setInterval(() => {
        setCurrentArticleIndex((prev) => (prev + 1) % articles.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [articles.length]);

  const fetchArticles = async () => {
    try {
      const articleData = await getWordPressPost();
      if (Array.isArray(articleData)) {
        const formattedArticles = articleData.slice(0, 6).map((post: any) => ({
          id: post.id,
          title: post.title?.rendered || "No Title",
          excerpt: post.excerpt?.rendered?.replace(/<[^>]+>/g, "").slice(0, 120) + "..." || "",
          author: post._embedded?.author?.[0]?.name || "Unknown",
          date: new Date(post.date).toISOString().split("T")[0],
          category: "Blog",
          readTime: "4 min read",
          image: post.jetpack_featured_media_url || 
                 post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || 
                 "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
          url: post.link,
        }));
        setArticles(formattedArticles);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  const nextArticle = () => {
    setCurrentArticleIndex((prev) => (prev + 1) % articles.length);
  };

  const prevArticle = () => {
    setCurrentArticleIndex((prev) => (prev - 1 + articles.length) % articles.length);
  };

  const currentArticle = articles[currentArticleIndex];

  return (
    <div className="space-y-6">
      {/* Token Analysis - Reformatted */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader className="pb-4">
          <CardTitle className="text-white flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5 text-purple-400" />
            Token Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <DynamicTokenAnalysis
            selectedCrypto={selectedCrypto}
            currentPrice={currentPrice}
            priceChange={priceChange}
            cryptoOptions={cryptoOptions}
          />
        </CardContent>
      </Card>

      {/* Ad Banner - Centered */}
      <div className="w-full min-h-[200px] bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
        <AdBanner width={280} height={200} position="vertical" className="max-w-full h-full" />
      </div>

      {/* Articles Section */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader className="pb-4">
          <CardTitle className="text-white flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-blue-400" />
            Latest Articles
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {currentArticle ? (
            <div className="relative group">
              {/* Article Image - Clickable */}
              <div 
                className="relative h-48 overflow-hidden rounded-t-lg cursor-pointer"
                onClick={() => {
                  trackArticleClick(currentArticle.title, currentArticleIndex);
                  navigate(`/article/${currentArticle.id}`, { 
                    state: { article: currentArticle } 
                  });
                }}
              >
                <img 
                  src={currentArticle.image} 
                  alt={currentArticle.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
                
                {/* Navigation Arrows */}
                {articles.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-900/50 text-white hover:bg-gray-900/70 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        prevArticle();
                      }}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-900/50 text-white hover:bg-gray-900/70 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        nextArticle();
                      }}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
                
                {/* Article counter */}
                {articles.length > 1 && (
                  <div className="absolute top-2 right-2 bg-gray-900/70 text-white text-xs px-2 py-1 rounded">
                    {currentArticleIndex + 1} / {articles.length}
                  </div>
                )}
              </div>
              
              {/* Article Content */}
              <div className="p-4">
                {/* Clickable Headline */}
                <h4 
                  className="text-white text-sm font-semibold line-clamp-2 mb-2 animate-fade-in cursor-pointer hover:text-blue-400 transition-colors"
                  onClick={() => {
                    trackArticleClick(currentArticle.title, currentArticleIndex);
                    navigate(`/article/${currentArticle.id}`, { 
                      state: { article: currentArticle } 
                    });
                  }}
                >
                  {currentArticle.title}
                </h4>
                <p className="text-gray-400 text-xs line-clamp-3 mb-3 animate-fade-in">
                  {currentArticle.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-xs">{currentArticle.readTime}</span>
                  <span className="text-gray-500 text-xs">{currentArticle.date}</span>
                </div>
              </div>
              
              {/* Dots indicator */}
              {articles.length > 1 && (
                <div className="flex justify-center space-x-1 pb-4">
                  {articles.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentArticleIndex ? 'bg-blue-400' : 'bg-gray-600'
                      }`}
                      onClick={() => setCurrentArticleIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-400">
              <p>Loading articles...</p>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
