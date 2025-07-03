import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from "@/components/ui/sidebar";
import { AdBanner } from "@/components/AdBanner";
import { ArticleCard } from "@/components/ArticleCard";
import { TokenDataService } from "@/services/tokenDataService";
import { 
  ExternalLink, 
  ArrowRight, 
  TrendingUp, 
  TrendingDown,
  Coins,
  FileText,
  Star
} from "lucide-react";
import { getWordPressPost } from "../../../utils/api";

interface TokenSidebarProps {
  currentTokenId: string;
}

export function TokenSidebar({ currentTokenId }: TokenSidebarProps) {
  const [articles, setArticles] = useState<any[]>([]);
  const cryptoOptions = TokenDataService.getCryptoOptions();
  
  // Get random tokens excluding current one
  const otherTokens = cryptoOptions
    .filter(token => token.value !== currentTokenId)
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const articleData = await getWordPressPost();
      if (Array.isArray(articleData)) {
        const formattedArticles = articleData.slice(0, 4).map((post: any) => ({
          id: post.id,
          title: post.title?.rendered || "No Title",
          excerpt: post.excerpt?.rendered?.replace(/<[^>]+>/g, "") || "",
          author: post._embedded?.author?.[0]?.name || "Unknown",
          date: new Date(post.date).toISOString().split("T")[0],
          category: "Blog",
          readTime: "4 min read",
          image: post.jetpack_featured_media_url || 
                 post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || 
                 "https://via.placeholder.com/300",
          url: post.link,
        }));
        setArticles(formattedArticles);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  return (
    <Sidebar className="w-80" collapsible="icon">
      <SidebarContent className="bg-gray-900/50 border-l border-gray-700">
        {/* Ad Banner */}
        <div className="p-4">
          <div className="w-full min-h-[200px] bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
            <AdBanner width={280} height={200} position="vertical" className="w-full h-full" />
          </div>
        </div>

        {/* Articles Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-300 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Latest Articles
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-4 space-y-4">
              {articles.map((article) => (
                <div key={article.id} className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50">
                  <h4 className="text-white text-sm font-medium line-clamp-2 mb-2">
                    {article.title}
                  </h4>
                  <p className="text-gray-400 text-xs line-clamp-2 mb-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs">{article.readTime}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-blue-400 hover:text-blue-300 h-6 px-2"
                      onClick={() => window.open(article.url, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              <Link to="/blog">
                <Button variant="outline" className="w-full bg-gray-700/50 border-gray-600 text-white hover:bg-gray-600/50">
                  View All Articles
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* More Tokens Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-300 flex items-center gap-2">
            <Coins className="h-4 w-4" />
            Other Tokens
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-4 space-y-2">
              {otherTokens.map((token) => (
                <Link 
                  key={token.value} 
                  to={`/token/${token.value}`}
                  className="block"
                >
                  <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{token.icon}</span>
                        <div>
                          <div className="text-white text-sm font-medium">{token.symbol}</div>
                          <div className="text-gray-400 text-xs">{token.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs font-medium ${
                          token.prediction.startsWith('+') ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {token.prediction}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-400" />
                          <span className="text-gray-400 text-xs">{token.score}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              <Link to="/all-tokens">
                <Button variant="outline" className="w-full bg-gray-700/50 border-gray-600 text-white hover:bg-gray-600/50">
                  View All Tokens
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}