
import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, ShoppingCart, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface TokenPriceDisplayProps {
  currentPrice: number;
  priceChange: number;
}

export const TokenPriceDisplay: React.FC<TokenPriceDisplayProps> = ({
  currentPrice,
  priceChange
}) => {
  const handleBuy = () => {
    toast.success("Redirecting to buy...", {
      description: "This would redirect to a trading platform"
    });
  };

  const handleSell = () => {
    toast.success("Redirecting to sell...", {
      description: "This would redirect to a trading platform"
    });
  };

  return (
    <div className="lg:w-80">
      <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-gray-500/30 text-center backdrop-blur-sm shadow-xl">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="p-2 rounded-full bg-blue-500/20">
            <DollarSign className="h-5 w-5 text-blue-400" />
          </div>
          <div className="text-gray-300 text-sm font-medium">Current Price</div>
        </div>
        <div className="text-4xl font-bold text-white mb-3">
          ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
        </div>
        <div className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl mb-6 ${
          priceChange >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {priceChange >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          <span className="text-lg font-semibold">
            {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
          </span>
          <span className="text-sm opacity-80">24h</span>
        </div>
        
        {/* Prominent Buy/Sell Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleBuy}
            className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
            size="lg"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            BUY
          </Button>
          <Button
            onClick={handleSell}
            className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
            size="lg"
          >
            <Wallet className="h-5 w-5 mr-2" />
            SELL
          </Button>
        </div>
      </div>
    </div>
  );
};
