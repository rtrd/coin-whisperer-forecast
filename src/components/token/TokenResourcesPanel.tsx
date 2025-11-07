import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Globe, Search, BarChart3, TrendingUp, MessageCircle, Users } from "lucide-react";
import { TokenInfo } from "@/hooks/useTokenInfo";

interface TokenResourcesPanelProps {
  tokenInfo?: TokenInfo;
  tokenId: string;
  isLoading?: boolean;
}

export const TokenResourcesPanel: React.FC<TokenResourcesPanelProps> = ({ 
  tokenInfo, 
  tokenId,
  isLoading 
}) => {
  if (isLoading) {
    return (
      <Card className="bg-card border-border animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-10 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasReddit = tokenInfo?.links?.subreddit_url;
  const hasTelegram = tokenInfo?.links?.chat_url?.[0];
  const hasForum = tokenInfo?.links?.official_forum_url?.[0];
  const hasBlockchainSite = tokenInfo?.links?.blockchain_site?.[0];

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="h-5 w-5" />
          Resources & Links
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Official Links */}
        {tokenInfo?.links?.homepage?.[0] && (
          <Button variant="outline" className="w-full justify-start gap-2" asChild>
            <a href={tokenInfo.links.homepage[0]} target="_blank" rel="noopener noreferrer">
              <Globe className="h-4 w-4 text-primary" />
              Official Website
              <ExternalLink className="h-3 w-3 ml-auto" />
            </a>
          </Button>
        )}

        {hasReddit && (
          <Button variant="outline" className="w-full justify-start gap-2" asChild>
            <a href={tokenInfo.links.subreddit_url} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4 text-orange-500" />
              Reddit Community
              <ExternalLink className="h-3 w-3 ml-auto" />
            </a>
          </Button>
        )}

        {hasTelegram && (
          <Button variant="outline" className="w-full justify-start gap-2" asChild>
            <a href={tokenInfo.links.chat_url[0]} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4 text-blue-500" />
              Telegram Channel
              <ExternalLink className="h-3 w-3 ml-auto" />
            </a>
          </Button>
        )}

        {hasForum && (
          <Button variant="outline" className="w-full justify-start gap-2" asChild>
            <a href={tokenInfo.links.official_forum_url[0]} target="_blank" rel="noopener noreferrer">
              <Users className="h-4 w-4 text-purple-500" />
              Official Forum
              <ExternalLink className="h-3 w-3 ml-auto" />
            </a>
          </Button>
        )}

        {/* Blockchain Explorers */}
        <div className="pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Block Explorers</p>
          
          {hasBlockchainSite ? (
            <Button variant="outline" className="w-full justify-start gap-2" asChild>
              <a href={tokenInfo.links.blockchain_site[0]} target="_blank" rel="noopener noreferrer">
                <Search className="h-4 w-4 text-blue-500" />
                Blockchain Explorer
                <ExternalLink className="h-3 w-3 ml-auto" />
              </a>
            </Button>
          ) : (
            <Button variant="outline" className="w-full justify-start gap-2" asChild>
              <a href={`https://etherscan.io/token/${tokenId}`} target="_blank" rel="noopener noreferrer">
                <Search className="h-4 w-4 text-blue-500" />
                View on Etherscan
                <ExternalLink className="h-3 w-3 ml-auto" />
              </a>
            </Button>
          )}
        </div>

        {/* Market Data */}
        <div className="pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Market Data</p>
          
          <Button variant="outline" className="w-full justify-start gap-2 mb-2" asChild>
            <a href={`https://www.coingecko.com/en/coins/${tokenId}`} target="_blank" rel="noopener noreferrer">
              <BarChart3 className="h-4 w-4 text-green-500" />
              View on CoinGecko
              <ExternalLink className="h-3 w-3 ml-auto" />
            </a>
          </Button>

          <Button variant="outline" className="w-full justify-start gap-2" asChild>
            <a href={`https://coinmarketcap.com/currencies/${tokenId}/`} target="_blank" rel="noopener noreferrer">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              View on CoinMarketCap
              <ExternalLink className="h-3 w-3 ml-auto" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
