import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, TrendingUp, Clock, Flame, Rocket, ExternalLink, Volume2 } from "lucide-react";
import { PumpToken } from "@/hooks/usePumpPortalData";
import { openAffiliateLink } from "@/utils/affiliateLinks";

interface LiveTokenFeedProps {
  tokens: PumpToken[];
  isConnected: boolean;
}

export const LiveTokenFeed: React.FC<LiveTokenFeedProps> = ({ tokens, isConnected }) => {
  // Limit to 5 most recent tokens
  const recentTokens = tokens.slice(0, 5);
  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return 'yesterday';
  };

  const formatNumber = (num: number) => {
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toFixed(0);
  };

  const getPumpIcon = (score: number) => {
    if (score >= 8) return <Rocket className="h-4 w-4 text-green-400" />;
    if (score >= 6) return <Flame className="h-4 w-4 text-orange-400" />;
    return <Sparkles className="h-4 w-4 text-purple-400" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">Live Token Feed</h3>
        </div>
        {isConnected && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400 font-medium">LIVE</span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {recentTokens.length === 0 ? (
          <Card className="bg-gray-800/30 border-gray-700">
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Waiting for new token launches...</p>
            </CardContent>
          </Card>
        ) : (
          recentTokens.map((token, index) => (
            <Card 
              key={`${token.contractAddress}-${index}`}
              className="bg-gray-800/40 border-gray-700 hover:bg-gray-800/60 transition-all duration-300 animate-fade-in"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  {/* Token Info */}
                  <div className="flex items-start gap-3 flex-1">
                    <div className="text-2xl bg-gray-700/50 p-2 rounded-lg">
                      {token.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-white text-sm">{token.symbol}</h4>
                        <Badge 
                          className={`text-xs px-2 py-0.5 ${
                            token.pumpScore >= 8 
                              ? 'bg-green-600/20 text-green-400 border-green-500/30' 
                              : token.pumpScore >= 6
                              ? 'bg-orange-600/20 text-orange-400 border-orange-500/30'
                              : 'bg-purple-600/20 text-purple-400 border-purple-500/30'
                          }`}
                        >
                          {getPumpIcon(token.pumpScore)}
                          {token.pumpScore.toFixed(1)}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-xs truncate mb-2">{token.name}</p>
                      
                      {/* Stats */}
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <Volume2 className="h-3 w-3 text-blue-400" />
                          <span className="text-gray-300">${formatNumber(token.volume)}</span>
                        </div>
                        <div className="text-gray-300">
                          MC: ${formatNumber(token.marketCap)}
                        </div>
                        {token.change24h !== 0 && (
                          <div className={`flex items-center gap-1 ${
                            token.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            <TrendingUp className={`h-3 w-3 ${token.change24h < 0 ? 'rotate-180' : ''}`} />
                            <span>{token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(1)}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Time and Actions */}
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <span className="text-xs text-gray-400">
                      {formatTimeAgo(Date.now() - (index * 60000))} {/* Mock time for demo */}
                    </span>
                    <div className="flex flex-col gap-1">
                      <Button
                        size="sm"
                        className="h-7 px-2 text-xs bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                        onClick={() => window.open('https://app.andmilo.com/auth/signin/b103d893-d5b8-4cb3-8b67-1f356abb314f', '_blank')}
                      >
                        <Rocket className="h-3 w-3 mr-1" />
                        Trade With AI Agent
                      </Button>
                      <Button
                        size="sm"
                        className="h-7 px-2 text-xs bg-purple-600 hover:bg-purple-700"
                        onClick={() => openAffiliateLink(token.symbol)}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Trade on eToro
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};