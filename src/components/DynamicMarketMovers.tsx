
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Volume2 } from "lucide-react";

interface MarketMover {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  icon: string;
  predictedChange: number;
  score: number;
  volume24h?: number;
}

export const DynamicMarketMovers = () => {
  const [movers, setMovers] = useState<{gainers: MarketMover[], losers: MarketMover[], trending: MarketMover[]}>({
    gainers: [],
    losers: [],
    trending: []
  });

  const baseTokens: MarketMover[] = [
    { symbol: 'BONK', name: 'Bonk', price: 0.0000045, change24h: 45.2, icon: '🔨', predictedChange: 78.5, score: 9.2, volume24h: 2500000000 },
    { symbol: 'PEPE', name: 'Pepe', price: 0.0000012, change24h: 38.7, icon: '🐸', predictedChange: 65.3, score: 8.8, volume24h: 1800000000 },
    { symbol: 'FET', name: 'Fetch.ai', price: 0.45, change24h: 28.4, icon: '🤖', predictedChange: 52.1, score: 8.5, volume24h: 850000000 },
    { symbol: 'RNDR', name: 'Render', price: 2.8, change24h: 22.1, icon: '🎨', predictedChange: 41.7, score: 8.1, volume24h: 1200000000 },
    { symbol: 'INJ', name: 'Injective', price: 25, change24h: 18.9, icon: '💉', predictedChange: 35.2, score: 7.9, volume24h: 950000000 },
    { symbol: 'FLOKI', name: 'Floki', price: 0.00012, change24h: 32.1, icon: '🐺', predictedChange: 42.3, score: 7.2, volume24h: 650000000 },
    { symbol: 'SHIB', name: 'Shiba Inu', price: 0.000008, change24h: 25.3, icon: '🐕‍🦺', predictedChange: 35.8, score: 5.9, volume24h: 3200000000 },
    { symbol: 'DOGE', name: 'Dogecoin', price: 0.08, change24h: 18.5, icon: '🐕', predictedChange: 28.7, score: 6.1, volume24h: 2800000000 },
    { symbol: 'SOL', name: 'Solana', price: 98.5, change24h: 15.8, icon: '◎', predictedChange: 25.2, score: 8.1, volume24h: 4100000000 },
    { symbol: 'USDT', name: 'Tether', price: 1.0, change24h: -0.1, icon: '💵', predictedChange: -0.05, score: 3.2, volume24h: 15000000000 },
    { symbol: 'DASH', name: 'Dash', price: 35, change24h: -8.5, icon: '💨', predictedChange: -12.3, score: 4.1, volume24h: 320000000 },
    { symbol: 'XMR', name: 'Monero', price: 155, change24h: -6.2, icon: '🔒', predictedChange: -8.9, score: 4.5, volume24h: 180000000 },
    { symbol: 'ZEC', name: 'Zcash', price: 28, change24h: -5.8, icon: '🛡️', predictedChange: -7.2, score: 4.8, volume24h: 150000000 },
    { symbol: 'CAKE', name: 'PancakeSwap', price: 2.8, change24h: -4.3, icon: '🥞', predictedChange: -6.1, score: 5.2, volume24h: 420000000 },
  ];
   
  useEffect(() => {
    const updateMovers = () => {
      // Shuffle and add random variations to simulate dynamic market
      const shuffledTokens = [...baseTokens].map(token => ({
        ...token,
        change24h: token.change24h + (Math.random() - 0.5) * 10,
        predictedChange: token.predictedChange + (Math.random() - 0.5) * 15,
        price: token.price * (1 + (Math.random() - 0.5) * 0.1),
        volume24h: (token.volume24h || 100000000) * (1 + (Math.random() - 0.5) * 0.3)
      }));

      // Sort by predicted change for gainers/losers
      shuffledTokens.sort((a, b) => b.predictedChange - a.predictedChange);
      
      const gainers = shuffledTokens.filter(t => t.predictedChange > 0).slice(0, 3);
      const losers = shuffledTokens.filter(t => t.predictedChange < 0).slice(-3).reverse();
      
      // Sort by volume for trending
      const trendingByVolume = [...shuffledTokens].sort((a, b) => (b.volume24h || 0) - (a.volume24h || 0)).slice(0, 3);
      
      setMovers({ gainers, losers, trending: trendingByVolume });
    };

    updateMovers();
    const interval = setInterval(updateMovers, 15000);

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    if (price < 0.001) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 8, maximumFractionDigits: 8 });
    } else if (price < 1) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
    }
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatChange = (change: number) => {
    return `${change > 0 ? '+' : ''}${change.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `$${(volume / 1e9).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}B`;
    if (volume >= 1e6) return `$${(volume / 1e6).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}M`;
    return `$${(volume / 1e3).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}K`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
      {/* Biggest Gainers */}
      <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-700/50">
        <CardHeader className="pb-0.5 pt-1.5 px-2">
          <CardTitle className="text-white flex items-center gap-1 text-xs">
            <TrendingUp className="h-2 w-2 text-green-400" />
            Top 3 Gainers
            <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-1.5 px-2">
          <div className="space-y-0.5">
            {movers.gainers.map((crypto, index) => (
              <div key={`${crypto.symbol}-${index}`} className="flex items-center justify-between p-0.5 bg-gray-800/50 rounded text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-xs">{crypto.icon}</span>
                  <div>
                    <div className="text-white font-medium text-xs">{crypto.symbol.toUpperCase()}</div>
                    <div className="text-gray-400 text-xs">${formatPrice(crypto.price)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-medium text-xs">
                    {formatChange(crypto.predictedChange)}
                  </div>
                  <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-400 px-0.5 py-0 h-3 text-xs">
                    {crypto.score.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Biggest Losers */}
      <Card className="bg-gradient-to-br from-red-900/20 to-rose-900/20 border-red-700/50">
        <CardHeader className="pb-0.5 pt-1.5 px-2">
          <CardTitle className="text-white flex items-center gap-1 text-xs">
            <TrendingDown className="h-2 w-2 text-red-400" />
            Top 3 Losers
            <div className="w-1 h-1 bg-red-400 rounded-full animate-pulse"></div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-1.5 px-2">
          <div className="space-y-0.5">
            {movers.losers.map((crypto, index) => (
              <div key={`${crypto.symbol}-${index}`} className="flex items-center justify-between p-0.5 bg-gray-800/50 rounded text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-xs">{crypto.icon}</span>
                  <div>
                    <div className="text-white font-medium text-xs">{crypto.symbol.toUpperCase()}</div>
                    <div className="text-gray-400 text-xs">${formatPrice(crypto.price)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-red-400 font-medium text-xs">
                    {formatChange(crypto.predictedChange)}
                  </div>
                  <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-400 px-0.5 py-0 h-3 text-xs">
                    {crypto.score.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trending by Volume */}
      <Card className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border-blue-700/50">
        <CardHeader className="pb-0.5 pt-1.5 px-2">
          <CardTitle className="text-white flex items-center gap-1 text-xs">
            <Volume2 className="h-2 w-2 text-blue-400" />
            Top 3 Volume
            <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-1.5 px-2">
          <div className="space-y-0.5">
            {movers.trending.map((crypto, index) => (
              <div key={`${crypto.symbol}-trending-${index}`} className="flex items-center justify-between p-0.5 bg-gray-800/50 rounded text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-xs">{crypto.icon}</span>
                  <div>
                    <div className="text-white font-medium text-xs">{crypto.symbol.toUpperCase()}</div>
                    <div className="text-gray-400 text-xs">${formatPrice(crypto.price)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-blue-400 font-medium text-xs">
                    {formatVolume(crypto.volume24h || 0)}
                  </div>
                  <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-400 px-0.5 py-0 h-3 text-xs">
                    {crypto.score.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
