import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Rocket, TrendingUp, TrendingDown, ExternalLink, ChevronDown, ChevronUp, Sparkles, LayoutList, LayoutGrid } from "lucide-react";

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
  const [topPerformers, setTopPerformers] = useState<PumpToken[]>([]);
  const [topLosers, setTopLosers] = useState<PumpToken[]>([]);
  const [newLaunches, setNewLaunches] = useState<PumpToken[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  useEffect(() => {
    // Mock data for top performers
    const mockTopPerformers: PumpToken[] = [
      { name: 'MoonShot', symbol: 'MOON', price: 0.0012, change24h: 1250, volume: 890000, marketCap: 2400000, icon: '🌙', pumpScore: 9.8 },
      { name: 'RocketCoin', symbol: 'ROCK', price: 0.00089, change24h: 890, volume: 650000, marketCap: 1800000, icon: '🚀', pumpScore: 9.5 },
      { name: 'LaserEyes', symbol: 'LASER', price: 0.0034, change24h: 650, volume: 1200000, marketCap: 5600000, icon: '👁️', pumpScore: 9.2 },
      { name: 'DiamondHands', symbol: 'DIAM', price: 0.0067, change24h: 450, volume: 980000, marketCap: 8900000, icon: '💎', pumpScore: 8.9 },
      { name: 'ToTheMoon', symbol: 'TTM', price: 0.0023, change24h: 320, volume: 750000, marketCap: 3400000, icon: '🌕', pumpScore: 8.7 }
    ];

    // Mock data for top losers
    const mockTopLosers: PumpToken[] = [
      { name: 'BearTrap', symbol: 'BEAR', price: 0.0008, change24h: -45, volume: 230000, marketCap: 890000, icon: '🐻', pumpScore: 3.2 },
      { name: 'RugPull', symbol: 'RUG', price: 0.0003, change24h: -67, volume: 150000, marketCap: 450000, icon: '🔻', pumpScore: 2.8 },
      { name: 'CrashCoin', symbol: 'CRASH', price: 0.0015, change24h: -38, volume: 340000, marketCap: 1200000, icon: '💥', pumpScore: 3.5 },
      { name: 'DownTrend', symbol: 'DOWN', price: 0.0021, change24h: -52, volume: 180000, marketCap: 780000, icon: '📉', pumpScore: 2.9 }
    ];

    // Mock data for new launches
    const mockNewLaunches: PumpToken[] = [
      { name: 'FreshStart', symbol: 'FRESH', price: 0.0005, change24h: 125, volume: 420000, marketCap: 650000, icon: '✨', pumpScore: 7.8 },
      { name: 'NewKid', symbol: 'NEWK', price: 0.0012, change24h: 89, volume: 380000, marketCap: 920000, icon: '🆕', pumpScore: 7.2 },
      { name: 'BabyToken', symbol: 'BABY', price: 0.0008, change24h: 67, volume: 290000, marketCap: 540000, icon: '👶', pumpScore: 6.9 },
      { name: 'Genesis', symbol: 'GEN', price: 0.0018, change24h: 156, volume: 510000, marketCap: 1100000, icon: '🌱', pumpScore: 8.1 }
    ];

    setTopPerformers(mockTopPerformers);
    setTopLosers(mockTopLosers);
    setNewLaunches(mockNewLaunches);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  };

  const renderTokenGrid = (tokens: PumpToken[], changeColorClass: string) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 px-2">
      {tokens.map((token, index) => (
        <div key={index} className="bg-card/50 border border-border rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{token.icon}</span>
              <div>
                <div className="text-foreground font-bold text-sm">{token.symbol}</div>
                <div className="text-muted-foreground text-xs">{token.name}</div>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
              {token.pumpScore}
            </Badge>
          </div>
          
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Price:</span>
              <span className="text-foreground">${token.price.toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">24h:</span>
              <span className={`${changeColorClass} font-bold`}>
                {token.change24h >= 0 ? '+' : ''}{token.change24h}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Volume:</span>
              <span className="text-foreground">${formatNumber(token.volume)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Market Cap:</span>
              <span className="text-foreground">${formatNumber(token.marketCap)}</span>
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
  );

  const renderTokenList = (tokens: PumpToken[], changeColorClass: string) => (
    <div className="space-y-2 px-2">
      {tokens.map((token, index) => (
        <div key={index} className="flex items-center justify-between bg-card/50 border border-border rounded-lg p-3">
          <div className="flex items-center gap-3">
            <span className="text-xl">{token.icon}</span>
            <div>
              <div className="text-foreground font-bold text-sm">{token.symbol}</div>
              <div className="text-muted-foreground text-xs">{token.name}</div>
            </div>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
              {token.pumpScore}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-xs">
            <div className="text-center">
              <div className="text-muted-foreground">Price</div>
              <div className="text-foreground">${token.price.toFixed(4)}</div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground">24h</div>
              <div className={`${changeColorClass} font-bold`}>
                {token.change24h >= 0 ? '+' : ''}{token.change24h}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground">Volume</div>
              <div className="text-foreground">${formatNumber(token.volume)}</div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground">Market Cap</div>
              <div className="text-foreground">${formatNumber(token.marketCap)}</div>
            </div>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              size="sm"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Trade
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="mb-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card className="bg-card/50 border-border shadow-2xl">
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
              <div className="flex items-center justify-between mb-4">
                <div className="text-muted-foreground text-sm">Choose your view preference</div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={`${
                      viewMode === "list" 
                        ? "" 
                        : "text-muted-foreground border-border bg-muted/30 hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    <LayoutList className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={`${
                      viewMode === "grid" 
                        ? "" 
                        : "text-muted-foreground border-border bg-muted/30 hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="text-foreground font-medium flex items-center gap-2 mb-4">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  Top Performers
                </h3>
                {viewMode === "grid" ? renderTokenGrid(topPerformers, 'text-green-400') : renderTokenList(topPerformers, 'text-green-400')}
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="text-foreground font-medium flex items-center gap-2 mb-4">
                  <TrendingDown className="h-4 w-4 text-red-400" />
                  Top Losers
                </h3>
                {viewMode === "grid" ? renderTokenGrid(topLosers, 'text-red-400') : renderTokenList(topLosers, 'text-red-400')}
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="text-foreground font-medium flex items-center gap-2 mb-4">
                  <Sparkles className="h-4 w-4 text-yellow-400" />
                  New Launches
                </h3>
                {viewMode === "grid" ? renderTokenGrid(newLaunches, 'text-green-400') : renderTokenList(newLaunches, 'text-green-400')}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
};
