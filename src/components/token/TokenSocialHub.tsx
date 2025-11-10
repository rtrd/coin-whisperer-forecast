import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Coins, TrendingUp, DollarSign, Clock } from "lucide-react";
import { TokenInfo } from "@/hooks/useTokenInfo";
import { useOnChainMetrics } from "@/hooks/useOnChainMetrics";
import { getTokenContract } from "@/utils/tokenContractMapping";
import { Skeleton } from "@/components/ui/skeleton";

interface TokenSocialHubProps {
  tokenInfo?: TokenInfo;
  isLoading?: boolean;
}

export const TokenSocialHub: React.FC<TokenSocialHubProps> = ({ tokenInfo, isLoading }) => {
  const tokenContract = tokenInfo ? getTokenContract(tokenInfo.id) : null;
  const { data: onChainData, isLoading: onChainLoading } = useOnChainMetrics(
    tokenContract?.address,
    tokenContract?.network
  );

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const marketCap = tokenInfo?.market_cap || 0;
  const totalVolume = tokenInfo?.total_volume || 0;
  
  // Real supply distribution from API
  const circulatingSupply = tokenInfo?.market_data?.circulating_supply || 0;
  const totalSupply = tokenInfo?.market_data?.total_supply || 0;
  const maxSupply = tokenInfo?.market_data?.max_supply;
  const supplyDistribution = totalSupply > 0 
    ? ((circulatingSupply / totalSupply) * 100)
    : null;

  const hasOnChainData = tokenContract && onChainData;

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          On-Chain Metrics
          {hasOnChainData && (
            <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              Live data
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Volume/Market Cap Ratio - Always available */}
        <div className="grid grid-cols-1 gap-3">
          <div className="text-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <TrendingUp className="h-5 w-5 text-blue-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">
              {((totalVolume / marketCap) * 100).toFixed(2)}%
            </p>
            <p className="text-xs text-muted-foreground">Vol/MCap Ratio</p>
            <p className="text-xs text-muted-foreground mt-1">Trading activity</p>
          </div>
        </div>

        {/* Holder Metrics - Only for tokens with on-chain data */}
        {onChainLoading && tokenContract ? (
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        ) : hasOnChainData ? (
          <div className="grid grid-cols-2 gap-3">
            {/* Total Holders */}
            <div className="text-center p-3 rounded-lg bg-primary/10 border border-primary/20">
              <Coins className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">
                {onChainData.totalHolders.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Total Holders</p>
              <p className={`text-xs font-medium mt-1 ${onChainData.holdersGrowth24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {onChainData.holdersGrowth24h >= 0 ? '+' : ''}{onChainData.holdersGrowth24h}% (24h)
              </p>
            </div>

            {/* Top Holder Concentration */}
            <div className="text-center p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <DollarSign className="h-5 w-5 text-amber-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">
                {onChainData.topHolderConcentration.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">Top 10 Holdings</p>
              {onChainData.topHolderConcentration > 50 && (
                <p className="text-xs text-amber-500 mt-1">⚠️ High concentration</p>
              )}
            </div>
          </div>
        ) : !tokenContract ? (
          <div className="text-center p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground">
              On-chain holder data not available for this token
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Available for EVM and Solana tokens only
            </p>
          </div>
        ) : null}

        {/* Supply Distribution - Always available if data exists */}
        {supplyDistribution !== null && (
          <div className="pt-3 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-foreground">Supply Distribution</p>
              <p className="text-sm font-bold text-primary">
                {supplyDistribution.toFixed(1)}%
              </p>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-primary/60" 
                style={{ width: `${supplyDistribution}%` }} 
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Circulating: {circulatingSupply.toLocaleString()}</span>
              <span>{maxSupply ? `Max: ${maxSupply.toLocaleString()}` : `Total: ${totalSupply.toLocaleString()}`}</span>
            </div>
          </div>
        )}

        {/* On-Chain Insight - Dynamic based on available data */}
        {hasOnChainData && (
          <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
            <p className="text-xs font-semibold text-primary mb-1">
              📊 On-Chain Insight
            </p>
            <p className="text-xs text-muted-foreground">
              {onChainData.totalHolders > 100000 ? "Large holder base indicates strong distribution. " : "Growing holder base - "}
              {onChainData.holderTrend === 'increasing' ? "📈 Holder count trending up. " : ""}
              {onChainData.topHolderConcentration > 50 ? "⚠️ High whale concentration detected." : "Well distributed among holders."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
