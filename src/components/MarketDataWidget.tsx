
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BarChart3, ExternalLink } from "lucide-react";

interface CryptoOption {
  value: string;
  label: string;
  icon: string;
  category: string;
  score: number;
  prediction: string;
}

interface MarketDataWidgetProps {
  cryptoOptions: CryptoOption[];
  showBuyButtons?: boolean;
}

export const MarketDataWidget: React.FC<MarketDataWidgetProps> = ({ 
  cryptoOptions,
  showBuyButtons = false 
}) => {
  const formatPrice = (crypto: CryptoOption) => {
    const basePrice = Math.random() * 1000 + 1;
    return basePrice < 1 ? `$${basePrice.toFixed(4)}` : `$${basePrice.toFixed(2)}`;
  };

  const formatChange = (crypto: CryptoOption) => {
    return (Math.random() - 0.5) * 20;
  };

  const formatVolume = () => {
    return Math.random() * 1000000000;
  };

  const formatMarketCap = () => {
    return Math.random() * 100000000000;
  };

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Card className="mb-8 bg-gray-800/50 border-gray-700 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2 text-shadow-lg">
          <BarChart3 className="h-5 w-5 text-blue-400" />
          Live Market Data
          <Badge className="bg-green-600">LIVE</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cryptoOptions.slice(0, 12).map((crypto, index) => {
            const price = formatPrice(crypto);
            const change24h = formatChange(crypto);
            const volume = formatVolume();
            const marketCap = formatMarketCap();
            
            return (
              <div key={index} className="p-4 bg-gray-700/50 rounded-lg border border-gray-600 hover:border-blue-500 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{crypto.icon}</span>
                    <div>
                      <div className="text-white font-bold text-sm">{crypto.label}</div>
                      <Badge variant="outline" className="text-xs mt-1">{crypto.category}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">{price}</div>
                    <div className={`flex items-center gap-1 text-xs ${
                      change24h >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {change24h >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}%
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1 text-xs text-gray-300 mb-3">
                  <div className="flex justify-between">
                    <span>Volume:</span>
                    <span>${formatNumber(volume)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Market Cap:</span>
                    <span>${formatNumber(marketCap)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AI Score:</span>
                    <span className="text-blue-400">{crypto.score}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Prediction:</span>
                    <span className={crypto.prediction.startsWith('+') ? 'text-green-400' : 'text-red-400'}>
                      {crypto.prediction}
                    </span>
                  </div>
                </div>

                {showBuyButtons && (
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      onClick={() => window.open('https://andmilo.com', '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Buy
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Details
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
