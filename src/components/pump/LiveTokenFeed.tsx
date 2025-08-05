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
  const formatLaunchTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    }
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
              
              <CardContent className="py-1.5 px-3">
                <div className="flex items-center w-full">
                  {/* Launch Time - 15% */}
                  <div className="w-[15%] min-w-0">
                    <div className="text-xs text-gray-400 mb-0.5">Launched</div>
                    <div className="font-mono text-xs text-white">{formatLaunchTime(token.timestamp)}</div>
                  </div>

                  {/* Token Info - 20% */}
                  <div className="flex items-center gap-2 w-1/5 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <h4 className="font-semibold text-white text-sm truncate">{token.symbol}</h4>
                    </div>
                    <p className="text-gray-400 text-xs truncate">{token.name}</p>
                  </div>

                  {/* Volume - 20% */}
                  <div className="w-1/5 text-right">
                    <div className="text-xs text-gray-400 mb-0.5">Volume</div>
                    <div className="font-mono text-sm text-white">${formatNumber(token.volume)}</div>
                  </div>

                  {/* Market Cap - 20% */}
                  <div className="w-1/5 text-right">
                    <div className="text-xs text-gray-400 mb-0.5">MCap</div>
                    <div className="font-mono text-sm text-white">${formatNumber(token.marketCap)}</div>
                  </div>

                  {/* Actions - 25% */}
                  <div className="w-1/4 flex justify-end gap-1">
                    <Button
                      size="sm"
                      className="h-6 px-2 text-xs bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      onClick={() => window.open('https://app.andmilo.com/auth/signin/b103d893-d5b8-4cb3-8b67-1f356abb314f', '_blank')}
                    >
                      Trade With AI Agent
                    </Button>
                    <Button
                      size="sm"
                      className="h-6 px-2 text-xs bg-green-600 border-green-600 text-white hover:bg-green-700"
                      onClick={() => openAffiliateLink(token.symbol)}
                    >
                      Trade on eToro
                    </Button>
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