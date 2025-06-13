
import React from 'react';
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

const MarketMovers = () => {
  const gainers: MarketMover[] = [
    { symbol: 'BONK', name: 'Bonk', price: 0.0000045, change24h: 45.2, icon: '🔨', predictedChange: 78.5, score: 9.2 },
    { symbol: 'PEPE', name: 'Pepe', price: 0.0000012, change24h: 38.7, icon: '🐸', predictedChange: 65.3, score: 8.8 },
    { symbol: 'FET', name: 'Fetch.ai', price: 0.45, change24h: 28.4, icon: '🤖', predictedChange: 52.1, score: 8.5 },
    { symbol: 'RNDR', name: 'Render', price: 2.8, change24h: 22.1, icon: '🎨', predictedChange: 41.7, score: 8.1 },
    { symbol: 'INJ', name: 'Injective', price: 25, change24h: 18.9, icon: '💉', predictedChange: 35.2, score: 7.9 }
  ];

  const losers: MarketMover[] = [
    { symbol: 'USDT', name: 'Tether', price: 1.0, change24h: -0.1, icon: '💵', predictedChange: -0.05, score: 3.2 },
    { symbol: 'DASH', name: 'Dash', price: 35, change24h: -8.5, icon: '💨', predictedChange: -12.3, score: 4.1 },
    { symbol: 'XMR', name: 'Monero', price: 155, change24h: -6.2, icon: '🔒', predictedChange: -8.9, score: 4.5 },
    { symbol: 'ZEC', name: 'Zcash', price: 28, change24h: -5.8, icon: '🛡️', predictedChange: -7.2, score: 4.8 },
    { symbol: 'CAKE', name: 'PancakeSwap', price: 2.8, change24h: -4.3, icon: '🥞', predictedChange: -6.1, score: 5.2 }
  ];

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Biggest Gainers */}
      <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            Biggest Potential Gainers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {gainers.map((crypto, index) => (
              <div key={crypto.symbol} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{crypto.icon}</span>
                  <div>
                    <div className="text-white font-medium">{crypto.symbol}</div>
                    <div className="text-gray-400 text-sm">${formatPrice(crypto.price)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-medium">
                    {formatChange(crypto.predictedChange)}
                  </div>
                  <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-400">
                    Score: {crypto.score.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Biggest Losers */}
      <Card className="bg-gradient-to-br from-red-900/20 to-rose-900/20 border-red-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-red-400" />
            Biggest Potential Losers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {losers.map((crypto, index) => (
              <div key={crypto.symbol} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{crypto.icon}</span>
                  <div>
                    <div className="text-white font-medium">{crypto.symbol}</div>
                    <div className="text-gray-400 text-sm">${formatPrice(crypto.price)}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-red-400 font-medium">
                    {formatChange(crypto.predictedChange)}
                  </div>
                  <Badge variant="outline" className="text-xs text-yellow-400 border-yellow-400">
                    Score: {crypto.score.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
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

export default MarketMovers;
