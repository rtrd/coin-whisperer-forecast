import React, { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Lock, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice, formatVolume, formatMarketCap } from "./MarketDataUtils";
import { getCategoryBadgeStyle, getAIScoreColor } from "@/utils/categoryStyles";
import { MarketData } from "@/types/crypto";

interface MarketDataGridCardProps {
  token: MarketData;
  index: number;
  isUnlocked: boolean;
  tokenUrlId: string;
  AllCryptosData?: any[]; // Optional, used for additional data display
}

export const MarketDataGridCard: React.FC<MarketDataGridCardProps> = memo(
  ({ token, index, isUnlocked, tokenUrlId, AllCryptosData }) => {
    return (
      <div className="bg-gray-800/60 border border-gray-600/50 rounded-xl p-4 flex flex-col h-full hover:bg-gray-800/80 transition-all duration-200 hover:border-gray-500/50">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm font-medium">
                #{index + 1}
              </span>
              <Link
                to={`/token/${tokenUrlId}`}
                className="flex items-center gap-2 hover:text-blue-400 transition-colors min-w-0"
              >
                <img
                  src={token.image}
                  alt={token.label}
                  className="w-6 h-6 object-contain rounded-full flex-shrink-0"
                />
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
            className={`text-xs shrink-0 ml-2 ${getCategoryBadgeStyle(
              token.category
            )}`}
          >
            {token.category}
          </Badge>
        </div>

        <div className="space-y-3 flex-1">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <div className="text-gray-400 text-xs uppercase tracking-wide">
                Price
              </div>
              <div className="text-white font-mono font-medium">
                {formatPrice(token.price)}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-gray-400 text-xs uppercase tracking-wide">
                24h Change
              </div>
              <div
                className={`flex items-center gap-1 font-bold font-mono ${
                  token.change24h >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
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
              <div className="text-gray-400 text-xs uppercase tracking-wide">
                Prediction %
              </div>
              {isUnlocked ? (
                <div
                  className={`font-mono font-medium ${
                    token.predictionPercentage >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
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
              <div className="text-gray-400 text-xs uppercase tracking-wide">
                AI Score
              </div>
              {isUnlocked ? (
                <div
                  className={`font-mono font-medium ${getAIScoreColor(
                    token.aiScore
                  )}`}
                >
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
              <div className="text-gray-400 text-xs uppercase tracking-wide">
                Volume
              </div>
              <div className="text-gray-300 font-mono">
                {formatVolume(token.volume24h)}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-gray-400 text-xs uppercase tracking-wide">
                Market Cap
              </div>
              <div className="text-gray-300 font-mono">
                {formatMarketCap(token.marketCap)}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-600/30">
          <Button
            size="sm"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            asChild
          >
            <Link to={`/token/${tokenUrlId}`} state={{ token, AllCryptosData }}>
              <ExternalLink className="h-3 w-3 mr-2" />
              View Details
            </Link>
          </Button>
        </div>
      </div>
    );
  }
);

MarketDataGridCard.displayName = "MarketDataGridCard";
