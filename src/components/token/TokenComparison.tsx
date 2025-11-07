import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, ArrowRightLeft } from "lucide-react";

interface TokenComparisonProps {
  tokenSymbol: string;
  marketCap?: number;
  volume24h?: number;
  priceChange24h?: number;
}

export const TokenComparison: React.FC<TokenComparisonProps> = ({
  tokenSymbol,
  marketCap = 0,
  volume24h = 0,
  priceChange24h = 0,
}) => {
  const [compareWith, setCompareWith] = useState<"BTC" | "ETH">("BTC");

  // Mock comparison data (in production, fetch from API)
  const comparisonData = {
    BTC: {
      marketCap: 1990641709458,
      volume24h: 82455671958,
      priceChange24h: -2.83,
    },
    ETH: {
      marketCap: 388944394441,
      volume24h: 37128591180,
      priceChange24h: -3.92,
    },
  };

  const compareData = comparisonData[compareWith];
  const marketCapRatio = marketCap / compareData.marketCap;
  const volumeRatio = volume24h / compareData.volume24h;
  const priceChangeDiff = priceChange24h - compareData.priceChange24h;

  const formatRatio = (ratio: number) => {
    if (ratio < 0.01) return `${(ratio * 100).toFixed(3)}%`;
    if (ratio < 1) return `${(ratio * 100).toFixed(2)}%`;
    return `${ratio.toFixed(2)}x`;
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-primary" />
            Compare Performance
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={compareWith === "BTC" ? "default" : "outline"}
              size="sm"
              onClick={() => setCompareWith("BTC")}
            >
              vs Bitcoin
            </Button>
            <Button
              variant={compareWith === "ETH" ? "default" : "outline"}
              size="sm"
              onClick={() => setCompareWith("ETH")}
            >
              vs Ethereum
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Market Cap Comparison */}
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground mb-2">Market Cap</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-foreground">{tokenSymbol.toUpperCase()}</span>
                <span className="text-sm font-semibold text-foreground">
                  ${(marketCap / 1e9).toFixed(2)}B
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">{compareWith}</span>
                <span className="text-sm text-muted-foreground">
                  ${(compareData.marketCap / 1e9).toFixed(2)}B
                </span>
              </div>
              <div className="pt-2 border-t border-border">
                <Badge variant="secondary" className="w-full justify-center">
                  {formatRatio(marketCapRatio)} of {compareWith}
                </Badge>
              </div>
            </div>
          </div>

          {/* Volume Comparison */}
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground mb-2">24h Volume</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-foreground">{tokenSymbol.toUpperCase()}</span>
                <span className="text-sm font-semibold text-foreground">
                  ${(volume24h / 1e9).toFixed(2)}B
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">{compareWith}</span>
                <span className="text-sm text-muted-foreground">
                  ${(compareData.volume24h / 1e9).toFixed(2)}B
                </span>
              </div>
              <div className="pt-2 border-t border-border">
                <Badge variant="secondary" className="w-full justify-center">
                  {formatRatio(volumeRatio)} of {compareWith}
                </Badge>
              </div>
            </div>
          </div>

          {/* Price Change Comparison */}
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground mb-2">24h Change</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-foreground">{tokenSymbol.toUpperCase()}</span>
                <span className={`text-sm font-semibold ${priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {priceChange24h >= 0 ? '+' : ''}{priceChange24h.toFixed(2)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">{compareWith}</span>
                <span className={`text-sm ${compareData.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {compareData.priceChange24h >= 0 ? '+' : ''}{compareData.priceChange24h.toFixed(2)}%
                </span>
              </div>
              <div className="pt-2 border-t border-border">
                <Badge 
                  variant={priceChangeDiff > 0 ? "default" : "secondary"}
                  className="w-full justify-center gap-1"
                >
                  {priceChangeDiff > 0 ? (
                    <>
                      <TrendingUp className="h-3 w-3" />
                      Outperforming
                    </>
                  ) : priceChangeDiff < 0 ? (
                    <>
                      <TrendingDown className="h-3 w-3" />
                      Underperforming
                    </>
                  ) : (
                    "Same performance"
                  )}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
