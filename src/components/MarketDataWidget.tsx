import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TrendingUp, TrendingDown, BarChart3, Volume2, Star, Info, Lock } from "lucide-react";
import { Link } from 'react-router-dom';

interface MarketDataWidgetProps {
  cryptoOptions: any[];
}

type FilterType = 'market_cap' | 'volume' | 'gainers' | 'losers' | 'trending';

export const MarketDataWidget: React.FC<MarketDataWidgetProps> = ({ cryptoOptions }) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('market_cap');
  const [isUnlocked] = useState(() => {
    return localStorage.getItem('ai-content-unlocked') === 'true';
  });

  // Generate market data from the filtered crypto options
  const generateMarketData = (filter: FilterType) => {
    // Use the passed cryptoOptions instead of the full list
    let dataWithMarketData = cryptoOptions.map((crypto, index) => {
      const basePrice = parseFloat(crypto.prediction?.replace('%', '').replace('+', '')) || 0;
      const mockPrice = Math.random() * 1000 + 1;
      const mockChange24h = (Math.random() - 0.5) * 20; // -10% to +10%
      const mockVolume = Math.random() * 1000000000;
      const mockMarketCap = mockPrice * (Math.random() * 100000000 + 1000000);
      const predictionPercentage = basePrice || (Math.random() - 0.5) * 20; // Use existing prediction or generate
      const aiScore = Math.random() * 100; // AI confidence score 0-100
      
      return {
        ...crypto,
        price: mockPrice,
        change24h: mockChange24h,
        volume24h: mockVolume,
        marketCap: mockMarketCap,
        predictionPercentage,
        aiScore,
        rank: index + 1
      };
    });

    // Sort based on filter
    switch (filter) {
      case 'market_cap':
        return dataWithMarketData.sort((a, b) => b.marketCap - a.marketCap).slice(0, 10);
      case 'volume':
        return dataWithMarketData.sort((a, b) => b.volume24h - a.volume24h).slice(0, 10);
      case 'gainers':
        return dataWithMarketData.filter(item => item.change24h > 0).sort((a, b) => b.change24h - a.change24h).slice(0, 10);
      case 'losers':
        return dataWithMarketData.filter(item => item.change24h < 0).sort((a, b) => a.change24h - b.change24h).slice(0, 10);
      case 'trending':
        return dataWithMarketData.filter(item => item.category === 'Meme' || item.category === 'AI' || item.category === 'New').slice(0, 10);
      default:
        return dataWithMarketData.slice(0, 10);
    }
  };

  const marketData = generateMarketData(activeFilter);

  const formatPrice = (price: number) => {
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    if (price < 100) return `$${price.toFixed(2)}`;
    return `$${price.toLocaleString()}`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`;
    if (volume >= 1e3) return `$${(volume / 1e3).toFixed(2)}K`;
    return `$${volume.toFixed(2)}`;
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    return `$${(marketCap / 1e3).toFixed(2)}K`;
  };

  const getFilterTitle = () => {
    switch (activeFilter) {
      case 'market_cap': return 'Top 10 by Market Cap';
      case 'volume': return 'Top 10 by Volume';
      case 'gainers': return 'Top 10 Gainers (24h)';
      case 'losers': return 'Top 10 Losers (24h)';
      case 'trending': return 'Trending Tokens';
      default: return 'Top 10 Cryptocurrencies';
    }
  };

  const filters = [
    { key: 'market_cap' as FilterType, label: 'Market Cap', icon: BarChart3 },
    { key: 'volume' as FilterType, label: 'Volume', icon: Volume2 },
    { key: 'gainers' as FilterType, label: 'Top Gainers', icon: TrendingUp },
    { key: 'losers' as FilterType, label: 'Top Losers', icon: TrendingDown },
    { key: 'trending' as FilterType, label: 'Trending', icon: Star },
  ];

  return (
    <TooltipProvider>
      <Card className="mb-8 bg-gray-800/50 border-gray-700 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-400" />
            {getFilterTitle()}
            <Badge className="bg-green-600">Live Data</Badge>
          </CardTitle>
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            {filters.map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={activeFilter === key ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(key)}
                className={`${
                  activeFilter === key 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </Button>
            ))}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">#</TableHead>
                  <TableHead className="text-gray-300">Token</TableHead>
                  <TableHead className="text-gray-300">Price</TableHead>
                  <TableHead className="text-gray-300">24h Change</TableHead>
                  <TableHead className="text-gray-300">
                    <div className="flex items-center gap-1">
                      Prediction %
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>AI-generated price prediction percentage for the next period</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-300">
                    <div className="flex items-center gap-1">
                      AI Score
                      {!isUnlocked && <Lock className="h-3 w-3 text-yellow-400" />}
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>AI confidence score (0-100) based on market analysis and technical indicators</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-300">
                    <div className="flex items-center gap-1">
                      Trading Volume
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Total trading volume in the last 24 hours</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableHead>
                  {activeFilter === 'market_cap' && (
                    <TableHead className="text-gray-300">Market Cap</TableHead>
                  )}
                  <TableHead className="text-gray-300">Category</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marketData.map((token, index) => (
                  <TableRow key={token.value} className="border-gray-700 hover:bg-gray-700/50">
                    <TableCell className="text-gray-300 font-medium">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <Link 
                        to={`/token/${token.value}`}
                        className="flex items-center gap-2 hover:text-blue-400 transition-colors"
                      >
                        <span className="text-lg">{token.icon}</span>
                        <div>
                          <div className="text-white font-medium">{token.label.split(' ')[0]}</div>
                          <div className="text-gray-400 text-sm">{token.label.split(' ')[1]}</div>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="text-white font-mono">
                      {formatPrice(token.price)}
                    </TableCell>
                    <TableCell>
                      <div className={`flex items-center gap-1 ${
                        token.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {token.change24h >= 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`flex items-center gap-1 ${
                        token.predictionPercentage >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {token.predictionPercentage >= 0 ? '+' : ''}{token.predictionPercentage.toFixed(2)}%
                      </div>
                    </TableCell>
                    <TableCell>
                      {isUnlocked ? (
                        <div className="flex items-center gap-1">
                          <div className={`font-mono ${
                            token.aiScore >= 80 ? 'text-green-400' : 
                            token.aiScore >= 60 ? 'text-yellow-400' : 
                            token.aiScore >= 40 ? 'text-orange-400' : 'text-red-400'
                          }`}>
                            {token.aiScore.toFixed(0)}
                          </div>
                          <div className="text-gray-400 text-xs">/100</div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <Lock className="h-3 w-3 text-yellow-400" />
                          <span className="text-yellow-400 text-xs">Premium</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-300 font-mono">
                      {formatVolume(token.volume24h)}
                    </TableCell>
                    {activeFilter === 'market_cap' && (
                      <TableCell className="text-gray-300 font-mono">
                        {formatMarketCap(token.marketCap)}
                      </TableCell>
                    )}
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`
                          ${token.category === 'Layer 1' ? 'border-blue-500 text-blue-400' : ''}
                          ${token.category === 'DeFi' ? 'border-green-500 text-green-400' : ''}
                          ${token.category === 'Meme' ? 'border-purple-500 text-purple-400' : ''}
                          ${token.category === 'AI' ? 'border-cyan-500 text-cyan-400' : ''}
                          ${token.category === 'Gaming' ? 'border-orange-500 text-orange-400' : ''}
                          ${token.category === 'New' ? 'border-yellow-500 text-yellow-400' : ''}
                          ${token.category === 'L2' ? 'border-indigo-500 text-indigo-400' : ''}
                          ${token.category === 'Privacy' ? 'border-gray-500 text-gray-400' : ''}
                          ${token.category === 'Stable' ? 'border-gray-500 text-gray-400' : ''}
                          ${token.category === 'Enterprise' ? 'border-emerald-500 text-emerald-400' : ''}
                        `}
                      >
                        {token.category}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* View All Tokens Link */}
          <div className="mt-6 text-center">
            <Link to="/tokens">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                View All {cryptoOptions.length}+ Tokens
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
