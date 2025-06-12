import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
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
        <div key={index} className="bg-gray-700/50 border border-gray-600 rounded-lg p-3 space-y-2">
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
              <span className={`${changeColorClass} font-bold`}>
                {token.change24h >= 0 ? '+' : ''}{token.change24h}%
              </span>
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
  );

  const renderTokenList = (tokens: PumpToken[], changeColorClass: string) => (
    <div className="overflow-x-auto">
      <Table className="w-full table-fixed">
        <TableHeader>
          <TableRow className="border-gray-700 h-14">
            <TableHead className="text-gray-300 w-12 px-2">#</TableHead>
            <TableHead className="text-gray-300 w-48 px-2">Token</TableHead>
            <TableHead className="text-gray-300 w-32 px-2">Price</TableHead>
            <TableHead className="text-gray-300 w-32 px-2">24h Change</TableHead>
            <TableHead className="text-gray-300 w-28 px-2">Pump Score</TableHead>
            <TableHead className="text-gray-300 w-40 px-2">Trading Volume</TableHead>
            <TableHead className="text-gray-300 w-32 px-2">Market Cap</TableHead>
            <TableHead className="text-gray-300 w-28 px-2">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tokens.map((token, index) => (
            <TableRow key={index} className="border-gray-700 hover:bg-gray-700/50">
              <TableCell className="text-gray-300 text-sm font-medium px-2">
                #{index + 1}
              </TableCell>
              <TableCell className="px-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{token.icon}</span>
                  <div>
                    <div className="text-white font-bold text-sm">{token.symbol}</div>
                    <div className="text-gray-400 text-xs">{token.name}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-white font-mono text-sm px-2">
                ${token.price.toFixed(4)}
              </TableCell>
              <TableCell className="px-2">
                <div className={`flex items-center gap-1 ${changeColorClass}`}>
                  {token.change24h >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span className="font-mono text-sm">
                    {token.change24h >= 0 ? "+" : ""}{token.change24h}%
                  </span>
                </div>
              </TableCell>
              <TableCell className="px-2">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                  {token.pumpScore}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-300 font-mono text-sm px-2">
                ${formatNumber(token.volume)}
              </TableCell>
              <TableCell className="text-gray-300 font-mono text-sm px-2">
                ${formatNumber(token.marketCap)}
              </TableCell>
              <TableCell className="px-2">
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  size="sm"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Trade
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="mb-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card className="bg-gray-800/50 border-gray-700 shadow-2xl">
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-4 cursor-pointer">
              <CardTitle className="text-white flex items-center justify-between text-lg">
                <div className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-purple-400" />
                  Solana Memecoin Insights
                  <Badge className="bg-green-600 text-white">LIVE</Badge>
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                </div>
                <Button variant="ghost" size="sm" className="text-gray-300 hover:bg-gray-700 hover:text-white flex items-center gap-1">
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
                <div className="text-gray-300 text-sm">Choose your view preference</div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={`${
                      viewMode === "list" 
                        ? "text-white" 
                        : "text-gray-300 border-gray-600 bg-gray-700/50 hover:bg-gray-600/50 hover:text-white"
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
                        ? "text-white" 
                        : "text-gray-300 border-gray-600 bg-gray-700/50 hover:bg-gray-600/50 hover:text-white"
                    }`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="text-white font-medium flex items-center gap-2 mb-4">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  Top Performers
                </h3>
                {viewMode === "grid" ? renderTokenGrid(topPerformers, 'text-green-400') : renderTokenList(topPerformers, 'text-green-400')}
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="text-white font-medium flex items-center gap-2 mb-4">
                  <TrendingDown className="h-4 w-4 text-red-400" />
                  Top Losers
                </h3>
                {viewMode === "grid" ? renderTokenGrid(topLosers, 'text-red-400') : renderTokenList(topLosers, 'text-red-400')}
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="text-white font-medium flex items-center gap-2 mb-4">
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
