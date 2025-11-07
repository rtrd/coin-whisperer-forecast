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

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
      {/* Market Cap Rank */}
      {marketCapRank && (
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-lg p-4 hover:scale-105 transition-transform duration-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground font-medium">Market Rank</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">#{marketCapRank}</span>
            <Badge variant="outline" className="text-xs border-primary/50 text-primary">
              Top {marketCapRank <= 10 ? '10' : marketCapRank <= 50 ? '50' : '100'}
            </Badge>
          </div>
        </div>
      )}

      {/* Volume/Market Cap Ratio */}
      {volumeToMcRatio && (
        <div className="bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30 rounded-lg p-4 hover:scale-105 transition-transform duration-200">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-accent" />
            <span className="text-xs text-muted-foreground font-medium">Liquidity</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">{volumeToMcRatio}%</span>
            <Badge 
              variant="outline" 
              className={`text-xs ${
                parseFloat(volumeToMcRatio) > 10 
                  ? 'border-green-500/50 text-green-400' 
                  : 'border-yellow-500/50 text-yellow-400'
              }`}
            >
              {parseFloat(volumeToMcRatio) > 10 ? 'High' : 'Normal'}
            </Badge>
          </div>
        </div>
      )}

      {/* Fully Diluted Valuation */}
      {fullyDilutedValue && (
        <div className="bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/30 rounded-lg p-4 hover:scale-105 transition-transform duration-200">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-secondary" />
            <span className="text-xs text-muted-foreground font-medium">Fully Diluted</span>
          </div>
          <div>
            <span className="text-xl font-bold text-foreground">
              {formatMarketCap(fullyDilutedValue)}
            </span>
          </div>
        </div>
      )}

      {/* Circulating Supply % */}
      {circulatingPercent && (
        <div className="bg-gradient-to-br from-muted/40 to-muted/10 border border-border rounded-lg p-4 hover:scale-105 transition-transform duration-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">In Circulation</span>
          </div>
          <div className="space-y-2">
            <span className="text-2xl font-bold text-foreground">{circulatingPercent}%</span>
            <div className="w-full bg-muted/30 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
                style={{ width: `${circulatingPercent}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
