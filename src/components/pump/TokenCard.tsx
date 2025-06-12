
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

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

interface TokenCardProps {
  token: PumpToken;
  changeColorClass: string;
}

export const TokenCard: React.FC<TokenCardProps> = ({ token, changeColorClass }) => {
  const formatNumber = (num: number) => {
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-3 space-y-2">
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
  );
};
