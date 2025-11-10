import React from "react";
import { TrendingUp, TrendingDown, Activity, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatMarketCap, formatVolume } from "@/utils/formatters";

interface TokenQuickStatsProps {
  marketCapRank?: number;
  marketCap?: number;
  totalVolume?: number;
  circulatingSupply?: number;
  totalSupply?: number;
  maxSupply?: number;
  fdv?: number;
}

export const TokenQuickStats: React.FC<TokenQuickStatsProps> = ({
  marketCapRank,
  marketCap,
  totalVolume,
  circulatingSupply,
  totalSupply,
  maxSupply,
  fdv,
}) => {
  const volumeToMcRatio = marketCap && totalVolume 
    ? ((totalVolume / marketCap) * 100).toFixed(2) 
    : null;

  const circulatingPercent = circulatingSupply && (maxSupply || totalSupply)
    ? ((circulatingSupply / (maxSupply || totalSupply!)) * 100).toFixed(1)
    : null;

  const fullyDilutedValue = fdv || (maxSupply && (marketCap && circulatingSupply) 
    ? (marketCap / circulatingSupply) * maxSupply 
    : null);

  // Liquidity health assessment
  const getLiquidityHealth = (ratio: number) => {
    if (ratio >= 15) return { label: "Excellent", color: "text-green-500", bgColor: "bg-green-500/20", level: 100 };
    if (ratio >= 8) return { label: "Good", color: "text-blue-500", bgColor: "bg-blue-500/20", level: 75 };
    if (ratio >= 3) return { label: "Fair", color: "text-yellow-500", bgColor: "bg-yellow-500/20", level: 50 };
    return { label: "Low", color: "text-red-500", bgColor: "bg-red-500/20", level: 25 };
  };

  const liquidityHealth = volumeToMcRatio ? getLiquidityHealth(parseFloat(volumeToMcRatio)) : null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
      {/* Market Cap Rank */}
      {marketCapRank && (
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-lg p-4 hover:scale-105 transition-transform duration-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground font-medium">Market Rank</span>
          </div>
          <div>
            <span className="text-2xl font-bold text-foreground">#{marketCapRank}</span>
          </div>
        </div>
      )}

      {/* Volume/Market Cap Ratio */}
      {volumeToMcRatio && liquidityHealth && (
        <div className="bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30 rounded-lg p-4 hover:scale-105 transition-transform duration-200">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-accent" />
            <span className="text-xs text-muted-foreground font-medium">Liquidity</span>
          </div>
          <div className="space-y-2">
            <span className="text-2xl font-bold text-foreground">{volumeToMcRatio}%</span>
            
            {/* Liquidity Health Indicator */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold ${liquidityHealth.color}`}>
                  {liquidityHealth.label}
                </span>
                <span className="text-[10px] text-muted-foreground">Health</span>
              </div>
              <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${liquidityHealth.bgColor} transition-all duration-500`}
                  style={{ width: `${liquidityHealth.level}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fully Diluted Valuation */}
      <div className="bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/30 rounded-lg p-4 hover:scale-105 transition-transform duration-200">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="h-4 w-4 text-secondary" />
          <span className="text-xs text-muted-foreground font-medium">Fully Diluted</span>
        </div>
        <div>
          <span className="text-2xl font-bold text-foreground">
            {fullyDilutedValue ? formatMarketCap(fullyDilutedValue) : '—'}
          </span>
        </div>
      </div>

      {/* Circulating Supply % */}
      {circulatingPercent && (
        <div className="bg-gradient-to-br from-muted/40 to-muted/10 border border-border rounded-lg p-4 hover:scale-105 transition-transform duration-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">In Circulation</span>
          </div>
          <div>
            <span className="text-2xl font-bold text-foreground">{circulatingPercent}%</span>
          </div>
        </div>
      )}
    </div>
  );
};
