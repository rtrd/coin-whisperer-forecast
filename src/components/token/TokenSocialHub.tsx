import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Twitter, MessageCircle, Users, Globe, TrendingUp, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TokenInfo } from "@/hooks/useTokenInfo";

interface TokenSocialHubProps {
  tokenInfo?: TokenInfo;
  isLoading?: boolean;
}

export const TokenSocialHub: React.FC<TokenSocialHubProps> = ({ tokenInfo, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700 animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-700 rounded w-1/3" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-20 bg-gray-700 rounded" />
            <div className="h-20 bg-gray-700 rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const socialLinks = tokenInfo?.links;
  const hasTwitter = socialLinks?.twitter_screen_name;
  const hasHomepage = socialLinks?.homepage?.[0];

  return (
    <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Users className="h-5 w-5 text-primary" />
          Community & Social
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Social Links Bar */}
        <div className="grid grid-cols-2 gap-3">
          {hasTwitter && (
            <Button
              variant="outline"
              className="bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20 text-blue-400"
              asChild
            >
              <a
                href={`https://twitter.com/${hasTwitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <Twitter className="h-4 w-4" />
                Twitter
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          )}
          
          {hasHomepage && (
            <Button
              variant="outline"
              className="bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20 text-purple-400"
              asChild
            >
              <a
                href={hasHomepage}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <Globe className="h-4 w-4" />
                Website
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          )}
        </div>

        {/* Social Sentiment */}
        <div className="bg-gradient-to-r from-green-500/10 to-red-500/10 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-300 font-medium">Social Sentiment</span>
            <Badge variant="outline" className="border-primary/50 text-primary">
              <TrendingUp className="h-3 w-3 mr-1" />
              Trending
            </Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Bullish</span>
                <span>Bearish</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full transition-all duration-500"
                  style={{ width: '65%' }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span className="text-green-400 font-medium">65%</span>
                <span className="text-red-400 font-medium">35%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        {tokenInfo?.categories && tokenInfo.categories.length > 0 && (
          <div>
            <h4 className="text-sm text-gray-300 font-medium mb-2">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {tokenInfo.categories.slice(0, 3).map((category, idx) => (
                <Badge 
                  key={idx} 
                  variant="secondary"
                  className="bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 cursor-pointer transition-colors"
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
