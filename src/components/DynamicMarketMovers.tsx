import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MarketMover {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  icon: string;
  predictedChange: number;
  score: number;
}

export const DynamicMarketMovers = () => {
  const [movers, setMovers] = useState<{gainers: MarketMover[], losers: MarketMover[]}>({
    gainers: [],
    losers: []
  });

  const baseTokens: MarketMover[] = [
    { symbol: 'BONK', name: 'Bonk', price: 0.0000045, change24h: 45.2, icon: '🔨', predictedChange: 78.5, score: 9.2 },
    { symbol: 'PEPE', name: 'Pepe', price: 0.0000012, change24h: 38.7, icon: '🐸', predictedChange: 65.3, score: 8.8 },
    { symbol: 'FET', name: 'Fetch.ai', price: 0.45, change24h: 28.4, icon: '🤖', predictedChange: 52.1, score: 8.5 },
    { symbol: 'RNDR', name: 'Render', price: 2.8, change24h: 22.1, icon: '🎨', predictedChange: 41.7, score: 8.1 },
    { symbol: 'INJ', name: 'Injective', price: 25, change24h: 18.9, icon: '💉', predictedChange: 35.2, score: 7.9 },
    { symbol: 'FLOKI', name: 'Floki', price: 0.00012, change24h: 32.1, icon: '🐺', predictedChange: 42.3, score: 7.2 },
    { symbol: 'SHIB', name: 'Shiba Inu', price: 0.000008, change24h: 25.3, icon: '🐕‍🦺', predictedChange: 35.8, score: 5.9 },
    { symbol: 'DOGE', name: 'Dogecoin', price: 0.08, change24h: 18.5, icon: '🐕', predictedChange: 28.7, score: 6.1 },
    { symbol: 'SOL', name: 'Solana', price: 98.5, change24h: 15.8, icon: '◎', predictedChange: 25.2, score: 8.1 },
    { symbol: 'USDT', name: 'Tether', price: 1.0, change24h: -0.1, icon: '💵', predictedChange: -0.05, score: 3.2 },
    { symbol: 'DASH', name: 'Dash', price: 35, change24h: -8.5, icon: '💨', predictedChange: -12.3, score: 4.1 },
    { symbol: 'XMR', name: 'Monero', price: 155, change24h: -6.2, icon: '🔒', predictedChange: -8.9, score: 4.5 },
    { symbol: 'ZEC', name: 'Zcash', price: 28, change24h: -5.8, icon: '🛡️', predictedChange: -7.2, score: 4.8 },
    { symbol: 'CAKE', name: 'PancakeSwap', price: 2.8, change24h: -4.3, icon: '🥞', predictedChange: -6.1, score: 5.2 },
  ];

  useEffect(() => {
    const updateMovers = () => {
      // Shuffle and add random variations to simulate dynamic market
      const shuffledTokens = [...baseTokens].map(token => ({
        ...token,
        change24h: token.change24h + (Math.random() - 0.5) * 10,
        predictedChange: token.predictedChange + (Math.random() - 0.5) * 15,
        price: token.price * (1 + (Math.random() - 0.5) * 0.1)
      }));

      // Sort by predicted change
      shuffledTokens.sort((a, b) => b.predictedChange - a.predictedChange);
      
      const gainers = shuffledTokens.filter(t => t.predictedChange > 0).slice(0, 5);
      const losers = shuffledTokens.filter(t => t.predictedChange < 0).slice(-5).reverse();
      
      setMovers({ gainers, losers });
    };

    updateMovers();
    const interval = setInterval(updateMovers, 15000);

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    if (price < 0.001) {
      return price.toFixed(8);
    } else if (price < 1) {
      return price.toFixed(4);
    }
    return price.toFixed(2);
  };

  const formatChange = (change: number) => {
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
      {/* Biggest Gainers */}
      <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-700/50">
        <CardHeader className="pb-1 pt-2 px-3">
          <CardTitle className="text-white flex items-center gap-1.5 text-xs">
            <TrendingUp className="h-2.5 w-2.5 text-green-400" />
            Top 5 Potential Gainers
            <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-2 px-3">
          <div className="space-y-1">
            {movers.gainers.map((crypto, index) => (
              <div key={`${crypto.symbol}-${index}`} className="flex items-center justify-between p-1 bg-gray-800/50 rounded text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-xs">{crypto.icon}</span>
                  <div>
                    <div className="text-white font-medium">{crypto.symbol}</div>
                    <div className="text-gray-400 text-xs">${formatPrice(crypto.price)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-medium text-xs">
                    {formatChange(crypto.predictedChange)}
                  </div>
                  <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-400 px-1 py-0 h-4">
                    {crypto.score.toFixed(1)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Biggest Losers */}
      <Card className="bg-gradient-to-br from-red-900/20 to-rose-900/20 border-red-700/50">
        <CardHeader className="pb-1 pt-2 px-3">
          <CardTitle className="text-white flex items-center gap-1.5 text-xs">
            <TrendingDown className="h-2.5 w-2.5 text-red-400" />
            Top 5 Potential Losers
            <div className="w-1 h-1 bg-red-400 rounded-full animate-pulse"></div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-2 px-3">
          <div className="space-y-1">
            {movers.losers.map((crypto, index) => (
              <div key={`${crypto.symbol}-${index}`} className="flex items-center justify-between p-1 bg-gray-800/50 rounded text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-xs">{crypto.icon}</span>
                  <div>
                    <div className="text-white font-medium">{crypto.symbol}</div>
                    <div className="text-gray-400 text-xs">${formatPrice(crypto.price)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-red-400 font-medium text-xs">
                    {formatChange(crypto.predictedChange)}
                  </div>
                  <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-400 px-1 py-0 h-4">
                    {crypto.score.toFixed(1)}
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
