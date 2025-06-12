
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Lock, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice, formatVolume, formatMarketCap } from "./MarketDataUtils";

interface MarketDataGridProps {
  marketData: any[];
  isUnlocked: boolean;
  activeFilter: string;
}

export const MarketDataGrid: React.FC<MarketDataGridProps> = ({
  marketData,
  isUnlocked,
  activeFilter
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {marketData.map((token, index) => (
        <div key={token.value} className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-gray-300 text-sm font-medium">#{index + 1}</span>
              <Link
                to={`/token/${token.value}`}
                className="flex items-center gap-2 hover:text-blue-400 transition-colors"
              >
                <img src={token.image} alt={token.label} width={24} height={24} />
                <div>
                  <div className="text-white font-medium text-sm">
                    {token.name.split(" ")[0]}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {token.name.split(" ")[1]}
                  </div>
                </div>
              </Link>
            </div>
            <Badge
              variant="outline"
              className={`text-xs
                ${
                  token.category === "Layer 1 (L1)"
                    ? "border-blue-500 text-blue-400"
                    : token.category === "DeFi"
                    ? "border-green-500 text-green-400"
                    : token.category === "Meme Coin"
                    ? "border-purple-500 text-purple-400"
                    : token.category === "AI"
                    ? "border-cyan-500 text-cyan-400"
                    : token.category === "Gaming"
                    ? "border-orange-500 text-orange-400"
                    : token.category === "New"
                    ? "border-yellow-500 text-yellow-400"
                    : token.category === "L2"
                    ? "border-indigo-500 text-indigo-400"
                    : token.category === "Privacy"
                    ? "border-gray-500 text-gray-400"
                    : token.category === "Stablecoin"
                    ? "border-gray-500 text-gray-400"
                    : token.category === "Payment Token"
                    ? "border-emerald-500 text-emerald-400"
                    : "border-red-500 text-red-400"
                }
              `}
            >
              {token.category}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="space-y-1">
              <div className="text-gray-400">Price</div>
              <div className="text-white font-mono">{formatPrice(token.price)}</div>
            </div>
            <div className="space-y-1">
              <div className="text-gray-400">24h Change</div>
              <div className={`flex items-center gap-1 ${
                token.change24h >= 0 ? "text-green-400" : "text-red-400"
              }`}>
                {token.change24h >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {token.change24h >= 0 ? "+" : ""}
                {token.change24h.toFixed(2)}%
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-gray-400">Prediction %</div>
              {isUnlocked ? (
                <div className={`${
                  token.predictionPercentage >= 0 ? "text-green-400" : "text-red-400"
                }`}>
                  {token.predictionPercentage >= 0 ? "+" : ""}
                  {token.predictionPercentage.toFixed(2)}%
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Lock className="h-3 w-3 text-yellow-400" />
                  <span className="text-yellow-400 text-xs">Premium</span>
                </div>
              )}
            </div>
            <div className="space-y-1">
              <div className="text-gray-400">AI Score</div>
              {isUnlocked ? (
                <div className={`font-mono ${
                  token.aiScore >= 80
                    ? "text-green-400"
                    : token.aiScore >= 60
                    ? "text-yellow-400"
                    : token.aiScore >= 40 
                    ? "text-orange-400"
                    : "text-red-400"
                }`}>
                  {token.aiScore.toFixed(0)}/100
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Lock className="h-3 w-3 text-yellow-400" />
                  <span className="text-yellow-400 text-xs">Premium</span>
                </div>
              )}
            </div>
            <div className="space-y-1">
              <div className="text-gray-400">Volume</div>
              <div className="text-gray-300 font-mono">{formatVolume(token.volume24h)}</div>
            </div>
            <div className="space-y-1">
              <div className="text-gray-400">Market Cap</div>
              <div className="text-gray-300 font-mono">{formatMarketCap(token.marketCap)}</div>
            </div>
          </div>

          <Button 
            size="sm" 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            asChild
          >
            <Link to={`/token/${token.value}`}>
              <ExternalLink className="h-3 w-3 mr-1" />
              View Details
            </Link>
          </Button>
        </div>
      ))}
    </div>
  );
};
