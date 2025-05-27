
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, TrendingDown } from "lucide-react";

interface IndexHeaderProps {
  selectedCrypto: string;
  cryptoOptions: any[];
  currentPrice: number;
  priceChange: number;
}

export const IndexHeader: React.FC<IndexHeaderProps> = ({
  selectedCrypto,
  cryptoOptions,
  currentPrice,
  priceChange
}) => {
  console.log('IndexHeader - currentPrice:', currentPrice, 'priceChange:', priceChange);
  
  return (
    <div className="text-center mb-8">
      <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
        <Brain className="h-12 w-12 text-blue-400" />
        PumpParade
        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold">PRO</Badge>
        <Link to="/subscribe">
          <Button className="ml-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            Unlock Premium
          </Button>
        </Link>
      </h1>
      <p className="text-xl text-gray-300 max-w-3xl mx-auto">
        Advanced cryptocurrency price prediction using machine learning, technical analysis, and market sentiment
      </p>
      
      {/* Live Price Ticker */}
      <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700 max-w-md mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">
              {cryptoOptions.find(c => c.value === selectedCrypto)?.icon}
            </span>
            <div>
              <div className="text-white font-bold text-lg">
                ${currentPrice > 0 ? currentPrice.toFixed(currentPrice < 1 ? 6 : 2) : 'Loading...'}
              </div>
              <div className="text-gray-400 text-sm">
                {cryptoOptions.find(c => c.value === selectedCrypto)?.label.split(' ')[0]}
              </div>
            </div>
          </div>
          <div className="text-right">
            {currentPrice > 0 ? (
              <>
                <div className={`flex items-center gap-1 ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {priceChange >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span className="font-bold">
                    {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                  </span>
                </div>
                <div className="text-gray-400 text-xs">24h</div>
              </>
            ) : (
              <div className="text-gray-400 text-sm">Loading...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
