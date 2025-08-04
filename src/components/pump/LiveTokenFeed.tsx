import React, { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, TrendingUp, Clock, Flame, Rocket, ExternalLink, Volume2, Zap } from "lucide-react";
import { PumpToken } from "@/hooks/usePumpPortalData";
import { openAffiliateLink } from "@/utils/affiliateLinks";

interface LiveTokenFeedProps {
  tokens: PumpToken[];
  isConnected: boolean;
}

interface AnimatedToken extends PumpToken {
  id: string;
  isNew?: boolean;
}

export const LiveTokenFeed: React.FC<LiveTokenFeedProps> = ({ tokens, isConnected }) => {
  const [animatedTokens, setAnimatedTokens] = useState<AnimatedToken[]>([]);
  
  // Manage token feed with animations
  useEffect(() => {
    const latestTokens = tokens.slice(0, 5).map((token, index) => ({
      ...token,
      id: `${token.contractAddress}-${index}-${Date.now()}`,
      isNew: false
    }));
    
    if (animatedTokens.length === 0) {
      setAnimatedTokens(latestTokens);
      return;
    }
    
    // Check for new tokens
    const newTokenIds = new Set(latestTokens.map(t => t.contractAddress));
    const oldTokenIds = new Set(animatedTokens.map(t => t.contractAddress));
    
    const hasNewTokens = !latestTokens.every(token => oldTokenIds.has(token.contractAddress));
    
    if (hasNewTokens) {
      // Mark new tokens and animate them in
      const tokensWithAnimation = latestTokens.map(token => ({
        ...token,
        isNew: !oldTokenIds.has(token.contractAddress)
      }));
      
      setAnimatedTokens(tokensWithAnimation);
      
      // Remove new flag after animation
      setTimeout(() => {
        setAnimatedTokens(prev => prev.map(token => ({ ...token, isNew: false })));
      }, 500);
    }
  }, [tokens]);
  
  const recentTokens = animatedTokens;
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

      <div className="space-y-3 relative">
        {recentTokens.length === 0 ? (
          <Card className="border-border/30">
            <CardContent className="p-6 text-center">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Waiting for new token launches...</p>
            </CardContent>
          </Card>
        ) : (
          recentTokens.map((token, index) => (
            <Card 
              key={token.id}
              className={`border-border/30 hover:bg-muted/30 transition-all duration-500 overflow-hidden relative ${
                token.isNew 
                  ? 'animate-[slideInFromTop_0.5s_ease-out] border-primary/50 shadow-lg shadow-primary/20' 
                  : 'animate-fade-in'
              }`}
            >
              {token.isNew && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse"></div>
              )}
              
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  {/* Token Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center text-xl border border-border/50">
                        {token.icon}
                      </div>
                      {token.isNew && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center animate-pulse">
                          <Zap className="h-2 w-2 text-background" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-foreground text-base">{token.symbol}</h4>
                        <Badge 
                          className={`text-xs px-2 py-1 ${
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
                        {token.isNew && (
                          <Badge className="bg-primary/20 text-primary border-primary/30 animate-pulse">
                            NEW
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm truncate mb-3">{token.name}</p>
                      
                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 bg-muted/30 rounded-lg p-2">
                          <Volume2 className="h-4 w-4 text-blue-400" />
                          <div>
                            <div className="text-xs text-muted-foreground">Volume</div>
                            <div className="font-mono text-foreground">${formatNumber(token.volume)}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-muted/30 rounded-lg p-2">
                          <TrendingUp className="h-4 w-4 text-green-400" />
                          <div>
                            <div className="text-xs text-muted-foreground">Market Cap</div>
                            <div className="font-mono text-foreground">${formatNumber(token.marketCap)}</div>
                          </div>
                        </div>
                      </div>
                      
                      {token.change24h !== 0 && (
                        <div className={`flex items-center gap-1 mt-2 text-sm ${
                          token.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          <TrendingUp className={`h-3 w-3 ${token.change24h < 0 ? 'rotate-180' : ''}`} />
                          <span className="font-mono">24h: {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(1)}%</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Time and Actions */}
                  <div className="flex flex-col items-end gap-3 ml-4">
                    <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                      {formatTimeAgo(Date.now() - (index * 60000))}
                    </span>
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        className="h-8 px-3 text-xs bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 font-medium"
                        onClick={() => window.open('https://app.andmilo.com/auth/signin/b103d893-d5b8-4cb3-8b67-1f356abb314f', '_blank')}
                      >
                        <Rocket className="h-3 w-3 mr-1" />
                        Trade With AI Agent
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-3 text-xs border-primary/30 text-primary hover:bg-primary/10"
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