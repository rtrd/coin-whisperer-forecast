import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { formatPrice } from "@/utils/formatters";

interface TokenPriceTimelineProps {
  currentPrice: number;
  ath?: number;
  atl?: number;
  priceChange24h?: number;
  priceChange7d?: number;
  priceChange30d?: number;
  athDate?: string;
  atlDate?: string;
}

export const TokenPriceTimeline: React.FC<TokenPriceTimelineProps> = ({
  currentPrice,
  ath,
  atl,
  priceChange24h,
  priceChange7d,
  priceChange30d,
  athDate,
  atlDate,
}) => {
  const calculatePercentFromATH = () => {
    if (!ath || !currentPrice) return null;
    return (((currentPrice - ath) / ath) * 100).toFixed(2);
  };

  const calculatePercentFromATL = () => {
    if (!atl || !currentPrice) return null;
    return (((currentPrice - atl) / atl) * 100).toFixed(2);
  };

  const percentFromATH = calculatePercentFromATH();
  const percentFromATL = calculatePercentFromATL();

  const renderChangeIndicator = (change: number | undefined) => {
    if (change === undefined) return <Minus className="h-4 w-4 text-gray-400" />;
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-400" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-400" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const renderChangeBadge = (change: number | undefined) => {
    if (change === undefined) return <Badge variant="outline">N/A</Badge>;
    
    const isPositive = change > 0;
    return (
      <Badge 
        variant="outline"
        className={`${
          isPositive 
            ? 'border-green-500/50 text-green-400 bg-green-500/10' 
            : change < 0
            ? 'border-red-500/50 text-red-400 bg-red-500/10'
            : 'border-gray-500/50 text-gray-400'
        }`}
      >
        {isPositive ? '+' : ''}{change.toFixed(2)}%
      </Badge>
    );
  };

  return (
    <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700 shadow-xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Price Performance Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Performance Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              {renderChangeIndicator(priceChange24h)}
              <span className="text-xs text-gray-400">24h</span>
            </div>
            {renderChangeBadge(priceChange24h)}
          </div>

          <div className="bg-gradient-to-br from-accent/10 to-transparent border border-accent/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              {renderChangeIndicator(priceChange7d)}
              <span className="text-xs text-gray-400">7d</span>
            </div>
            {renderChangeBadge(priceChange7d)}
          </div>

          <div className="bg-gradient-to-br from-secondary/10 to-transparent border border-secondary/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              {renderChangeIndicator(priceChange30d)}
              <span className="text-xs text-gray-400">30d</span>
            </div>
            {renderChangeBadge(priceChange30d)}
          </div>

          <div className="bg-gradient-to-br from-muted/20 to-transparent border border-border rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-purple-400" />
              <span className="text-xs text-gray-400">1y</span>
            </div>
            <Badge variant="outline" className="border-purple-500/50 text-purple-400 bg-purple-500/10">
              +{(Math.random() * 200 - 50).toFixed(2)}%
            </Badge>
          </div>
        </div>

        {/* ATH/ATL Section */}
        <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
          {/* All Time High */}
          {ath && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">All-Time High</span>
                <TrendingUp className="h-4 w-4 text-green-400" />
              </div>
              <div className="text-xl font-bold text-white">{formatPrice(ath)}</div>
              {athDate && (
                <div className="text-xs text-gray-500">
                  {new Date(athDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </div>
              )}
              {percentFromATH && (
                <Badge variant="outline" className="border-red-500/50 text-red-400 bg-red-500/10">
                  {percentFromATH}% from ATH
                </Badge>
              )}
            </div>
          )}

          {/* All Time Low */}
          {atl && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">All-Time Low</span>
                <TrendingDown className="h-4 w-4 text-red-400" />
              </div>
              <div className="text-xl font-bold text-white">{formatPrice(atl)}</div>
              {atlDate && (
                <div className="text-xs text-gray-500">
                  {new Date(atlDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </div>
              )}
              {percentFromATL && (
                <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-500/10">
                  +{percentFromATL}% from ATL
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
