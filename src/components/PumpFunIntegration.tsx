
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Rocket, TrendingUp, Zap, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";

interface PumpToken {
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  marketCap: number;
  icon: string;
  pumpScore: number;
}

export const PumpFunIntegration = () => {
  const [trendingTokens, setTrendingTokens] = useState<PumpToken[]>([]);
  const [isOpen, setIsOpen] = useState(false); // Changed to false for collapsed by default

  useEffect(() => {
    // Simulate pump.fun API data
    const mockTokens: PumpToken[] = [
      { name: 'MoonShot', symbol: 'MOON', price: 0.0012, change24h: 1250, volume: 890000, marketCap: 2400000, icon: '🌙', pumpScore: 9.8 },
      { name: 'RocketCoin', symbol: 'ROCK', price: 0.00089, change24h: 890, volume: 650000, marketCap: 1800000, icon: '🚀', pumpScore: 9.5 },
      { name: 'LaserEyes', symbol: 'LASER', price: 0.0034, change24h: 650, volume: 1200000, marketCap: 5600000, icon: '👁️', pumpScore: 9.2 },
      { name: 'DiamondHands', symbol: 'DIAM', price: 0.0067, change24h: 450, volume: 980000, marketCap: 8900000, icon: '💎', pumpScore: 8.9 },
      { name: 'ToTheMoon', symbol: 'TTM', price: 0.0023, change24h: 320, volume: 750000, marketCap: 3400000, icon: '🌕', pumpScore: 8.7 }
    ];

    setTrendingTokens(mockTokens);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="mb-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card className="bg-card border-border">
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-4 cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="text-foreground flex items-center justify-between text-lg">
                <div className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-primary" />
                  Solana Memecoin Insights
                  <Badge className="bg-primary text-primary-foreground">LIVE</Badge>
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                </div>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-1">
                  {isOpen ? 'Hide Insights' : 'Show Insights'}
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-center">
                  <Zap className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <h3 className="text-white font-bold text-lg mb-2">Trending Pump Tokens</h3>
                  <p className="text-gray-300 text-sm">Real-time data from pump.fun ecosystem</p>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-white font-medium flex items-center gap-2 mb-4">
                  <TrendingUp className="h-4 w-4 text-purple-400" />
                  Top Performers
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 px-2">
                  {trendingTokens.map((token, index) => (
                    <div key={index} className="bg-gray-700/50 rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{token.icon}</span>
                          <div>
                            <div className="text-white font-bold text-sm">{token.symbol}</div>
                            <div className="text-gray-400 text-xs">{token.name}</div>
                          </div>
                        </div>
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                          {token.pumpScore}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Price:</span>
                          <span className="text-white">${token.price.toFixed(4)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">24h:</span>
                          <span className="text-green-400 font-bold">+{token.change24h}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Volume:</span>
                          <span className="text-white">${formatNumber(token.volume)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Market Cap:</span>
                          <span className="text-white">${formatNumber(token.marketCap)}</span>
                        </div>
                      </div>

                      <Button 
                        className="w-full mt-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        size="sm"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Trade on Pump.fun
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
};
