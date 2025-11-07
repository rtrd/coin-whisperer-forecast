import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ExternalLink, 
  FileText, 
  Github, 
  MessageSquare,
  Globe,
  Search,
  BookOpen
} from "lucide-react";
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
      <Card className="bg-gray-800/50 border-gray-700 animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-700 rounded w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-10 bg-gray-700 rounded" />
            <div className="h-10 bg-gray-700 rounded" />
            <div className="h-10 bg-gray-700 rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const links = tokenInfo?.links;
  const homepage = links?.homepage?.[0];
  
  const explorers = [
    { name: 'Etherscan', url: `https://etherscan.io/token/${tokenId}` },
    { name: 'CoinGecko', url: `https://www.coingecko.com/en/coins/${tokenId}` },
  ];

  return (
    <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <BookOpen className="h-5 w-5 text-accent" />
          Resources & Links
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {homepage && (
          <Button
            variant="outline"
            className="w-full justify-start bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30 hover:bg-primary/20 text-white hover:text-white group"
            asChild
          >
            <a
              href={homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3"
            >
              <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
                <Globe className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium">Official Website</div>
                <div className="text-xs text-muted-foreground">Visit homepage</div>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          </Button>
        )}

        {explorers.map((explorer, idx) => (
          <Button
            key={idx}
            variant="outline"
            className="w-full justify-start bg-gradient-to-r from-accent/10 to-accent/5 border-accent/30 hover:bg-accent/20 text-white hover:text-white group"
            asChild
          >
            <a
              href={explorer.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3"
            >
              <div className="p-2 bg-accent/20 rounded-lg group-hover:bg-accent/30 transition-colors">
                <Search className="h-4 w-4 text-accent" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium">{explorer.name}</div>
                <div className="text-xs text-muted-foreground">Block explorer</div>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          </Button>
        ))}

        <Button
          variant="outline"
          className="w-full justify-start bg-gradient-to-r from-secondary/10 to-secondary/5 border-secondary/30 hover:bg-secondary/20 text-white hover:text-white group"
          asChild
        >
          <a
            href={`https://coinmarketcap.com/currencies/${tokenId}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3"
          >
            <div className="p-2 bg-secondary/20 rounded-lg group-hover:bg-secondary/30 transition-colors">
              <MessageSquare className="h-4 w-4 text-secondary" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium">CoinMarketCap</div>
              <div className="text-xs text-muted-foreground">Market data</div>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};
