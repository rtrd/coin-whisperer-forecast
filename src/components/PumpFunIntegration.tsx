
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
  const [isOpen, setIsOpen] = useState(true);

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
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border-orange-700/50 shadow-2xl mb-8">
        <CollapsibleTrigger className="w-full">
          <CardHeader className="cursor-pointer hover:bg-orange-900/10 transition-colors">
            <CardTitle className="text-white flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-orange-400" />
                Pump.fun Integration
                <Badge className="bg-orange-600">LIVE</Badge>
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse ml-2"></div>
              </div>
              {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-4 bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-lg border border-orange-700/50">
                <Zap className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                <h3 className="text-white font-bold text-lg mb-2">Trending Pump Tokens</h3>
                <p className="text-gray-300 text-sm">Real-time data from pump.fun ecosystem</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trendingTokens.map((token, index) => (
                  <div key={index} className="p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{token.icon}</span>
                        <div>
                          <div className="text-white font-bold">{token.symbol}</div>
                          <div className="text-gray-400 text-xs">{token.name}</div>
                        </div>
                      </div>
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                        {token.pumpScore}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
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
                      className="w-full mt-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
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
  );
};
