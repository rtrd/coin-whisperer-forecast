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
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6 text-center">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-400">Waiting for new token launches...</p>
            </CardContent>
          </Card>
        ) : (
          recentTokens.map((token, index) => (
            <Card 
              key={token.id}
              className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors duration-200 overflow-hidden relative"
            >
              
              <CardContent className="p-2">
                <div className="flex items-center justify-between">
                  {/* Token Info */}
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center text-lg border border-gray-600/50">
                      {token.icon}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white text-sm">{token.symbol}</h4>
                        <Badge 
                          className={`text-xs px-1.5 py-0.5 ${
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
                      
                      {/* Inline Stats */}
                      <div className="flex items-center gap-3 text-xs text-gray-300">
                        <div className="flex items-center gap-1">
                          <Volume2 className="h-3 w-3" />
                          <span>Vol:</span>
                          <span className="font-mono text-gray-200">${formatNumber(token.volume)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          <span>MCap:</span>
                          <span className="font-mono text-gray-200">${formatNumber(token.marketCap)}</span>
                        </div>
                        {token.change24h !== 0 && (
                          <span className={`font-mono ${
                            token.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            24h: {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(1)}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Time and Actions */}
                  <div className="flex flex-col items-end gap-2 ml-3">
                    <span className="text-xs text-gray-400">
                      {formatTimeAgo(Date.now() - (index * 60000))}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        className="h-6 px-2 text-xs bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        onClick={() => window.open('https://app.andmilo.com/auth/signin/b103d893-d5b8-4cb3-8b67-1f356abb314f', '_blank')}
                      >
                        Trade With AI Agent
                      </Button>
                      <Button
                        size="sm"
                        className="h-6 px-2 text-xs bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                        onClick={() => openAffiliateLink(token.symbol)}
                      >
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