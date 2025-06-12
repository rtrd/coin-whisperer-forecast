
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {marketData.map((token, index) => (
        <div key={token.value} className="bg-gray-800/60 border border-gray-600/50 rounded-xl p-4 space-y-4 hover:bg-gray-800/80 transition-all duration-200 hover:border-gray-500/50">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm font-medium">#{index + 1}</span>
                <Link
                  to={`/token/${token.value}`}
                  className="flex items-center gap-2 hover:text-blue-400 transition-colors"
                >
                  <img src={token.image} alt={token.label} width={24} height={24} />
                  <div className="min-w-0">
                    <div className="text-white font-bold text-base truncate">
                      {token.name.split(" ")[0]}
                    </div>
                    <div className="text-gray-400 text-sm truncate">
                      {token.name.split(" ")[1]}
                    </div>
                  </div>
                </Link>
              </div>
            </div>
            <Badge
              variant="outline"
              className={`text-xs shrink-0
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

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="space-y-1">
                <div className="text-gray-400 text-xs uppercase tracking-wide">Price</div>
                <div className="text-white font-mono font-medium">{formatPrice(token.price)}</div>
              </div>
              <div className="space-y-1">
                <div className="text-gray-400 text-xs uppercase tracking-wide">24h Change</div>
                <div className={`flex items-center gap-1 font-bold font-mono ${
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
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="space-y-1">
                <div className="text-gray-400 text-xs uppercase tracking-wide">Prediction %</div>
                {isUnlocked ? (
                  <div className={`font-mono font-medium ${
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
                <div className="text-gray-400 text-xs uppercase tracking-wide">AI Score</div>
                {isUnlocked ? (
                  <div className={`font-mono font-medium ${
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
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="space-y-1">
                <div className="text-gray-400 text-xs uppercase tracking-wide">Volume</div>
                <div className="text-gray-300 font-mono">{formatVolume(token.volume24h)}</div>
              </div>
              <div className="space-y-1">
                <div className="text-gray-400 text-xs uppercase tracking-wide">Market Cap</div>
                <div className="text-gray-300 font-mono">{formatMarketCap(token.marketCap)}</div>
              </div>
            </div>
          </div>

          <Button 
            size="sm" 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            asChild
          >
            <Link to={`/token/${token.value}`}>
              <ExternalLink className="h-3 w-3 mr-2" />
              View Details
            </Link>
          </Button>
        </div>
      ))}
    </div>
  );
};
