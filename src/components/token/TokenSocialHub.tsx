import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Users, TrendingUp, Activity, Coins } from "lucide-react";
import { TokenInfo } from "@/hooks/useTokenInfo";
import { useOnChainMetrics } from "@/hooks/useOnChainMetrics";
import { getTokenContract } from "@/utils/tokenContractMapping";
import { Skeleton } from "@/components/ui/skeleton";
import { HolderDistributionChart } from "./HolderDistributionChart";

interface TokenSocialHubProps {
  tokenInfo?: TokenInfo;
  isLoading?: boolean;
}

export const TokenSocialHub: React.FC<TokenSocialHubProps> = ({ tokenInfo, isLoading }) => {
  const tokenContract = tokenInfo ? getTokenContract(tokenInfo.id) : null;
  
  console.log('[TokenSocialHub] Token info:', {
    tokenId: tokenInfo?.id,
    contractAddress: tokenContract?.address,
    network: tokenContract?.network
  });
  
  const { data: onChainData, isLoading: onChainLoading, error } = useOnChainMetrics(
    tokenContract?.address,
    tokenContract?.network
  );
  
  console.log('[TokenSocialHub] On-chain metrics:', { 
    onChainData, 
    isLoadingMetrics: onChainLoading, 
    error 
  });

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-32" />
        </CardContent>
      </Card>
    );
  }

  const marketCap = tokenInfo?.market_cap || 0;
  const totalVolume = tokenInfo?.total_volume || 0;
  const volMcapRatio = marketCap > 0 ? ((totalVolume / marketCap) * 100) : 0;
  
  // Supply data
  const circulatingSupply = tokenInfo?.market_data?.circulating_supply || 0;
  const totalSupply = tokenInfo?.market_data?.total_supply || 0;
  const maxSupply = tokenInfo?.market_data?.max_supply;
  const supplyPercentage = totalSupply > 0 
    ? ((circulatingSupply / totalSupply) * 100)
    : null;

  const hasOnChainData = tokenContract && onChainData;
  const showOnChainMetrics = !onChainLoading && hasOnChainData;

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Database className="h-5 w-5 text-primary" />
          On-Chain Metrics
          {hasOnChainData && (
            <span className="ml-auto text-xs font-normal text-muted-foreground">
              Live data
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Hero Metrics - Only show if we have on-chain data */}
        {onChainLoading && tokenContract ? (
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        ) : showOnChainMetrics ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Total Holders */}
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
              <Users className="h-5 w-5 text-primary mb-2" />
              <p className="text-2xl font-bold text-foreground">
                {onChainData.totalHolders.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Total Holders</p>
              {onChainData.holdersGrowth24h !== 0 && (
                <p className={`text-xs font-semibold mt-2 ${onChainData.holdersGrowth24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {onChainData.holdersGrowth24h >= 0 ? '+' : ''}{onChainData.holdersGrowth24h}% (24h)
                </p>
              )}
            </div>

            {/* 24h Change */}
            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <TrendingUp className="h-5 w-5 text-chart-2 mb-2" />
              <p className="text-2xl font-bold text-foreground">
                {Math.abs(onChainData.totalHolders - onChainData.holders24hAgo).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">New Holders (24h)</p>
              <p className="text-xs text-muted-foreground mt-2">
                {onChainData.holderTrend === 'increasing' ? '📈 Growing' : onChainData.holderTrend === 'decreasing' ? '📉 Declining' : '➡️ Stable'}
              </p>
            </div>

            {/* Concentration */}
            <div className={`rounded-lg p-4 border ${onChainData.topHolderConcentration > 50 ? 'bg-destructive/5 border-destructive/20' : 'bg-muted/50 border-border'}`}>
              <Coins className={`h-5 w-5 mb-2 ${onChainData.topHolderConcentration > 50 ? 'text-destructive' : 'text-chart-3'}`} />
              <p className="text-2xl font-bold text-foreground">
                {onChainData.topHolderConcentration.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">Top 10 Holdings</p>
              {onChainData.topHolderConcentration > 50 && (
                <p className="text-xs text-destructive font-semibold mt-2">⚠️ High concentration</p>
              )}
            </div>
          </div>
        ) : !tokenContract ? (
          <div className="text-center py-6 px-4 rounded-lg bg-muted/30 border border-border">
            <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              On-chain holder data not available for this token
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Available for EVM and Solana tokens only
            </p>
            {import.meta.env.DEV && tokenInfo && (
              <div className="text-xs text-muted-foreground/70 space-y-1 mt-3">
                <p>Debug: Token ID = {tokenInfo.id}</p>
                <p>Contract mapping not found in tokenContractMapping.ts</p>
              </div>
            )}
          </div>
        ) : tokenContract && !onChainData ? (
          <div className="text-center py-6 px-4 rounded-lg bg-muted/30 border border-border">
            <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Unable to fetch on-chain metrics
            </p>
            {import.meta.env.DEV && (
              <div className="text-xs text-muted-foreground/70 space-y-1 mt-3 max-w-md mx-auto text-left">
                <p className="font-semibold">Debug Info:</p>
                <p>Network: {tokenContract.network}</p>
                <p>Contract: {tokenContract.address}</p>
                {error && <p className="text-destructive">Error: {String(error)}</p>}
              </div>
            )}
          </div>
        ) : null}

        {/* Holder Distribution Chart */}
        {showOnChainMetrics && onChainData.holderDistribution && (
          <div className="pt-4 border-t border-border">
            <HolderDistributionChart distribution={onChainData.holderDistribution} />
          </div>
        )}

        {/* Activity Metrics */}
        <div className="pt-4 border-t border-border space-y-3">
          <p className="text-sm font-semibold text-foreground">Market Activity</p>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <span className="text-sm text-muted-foreground">Vol/MCap Ratio</span>
              <span className="text-sm font-bold text-foreground">
                {volMcapRatio.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        {/* Supply Distribution */}
        {supplyPercentage !== null && (
          <div className="pt-4 border-t border-border space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Supply Distribution</p>
              <p className="text-sm font-bold text-primary">
                {supplyPercentage.toFixed(1)}%
              </p>
            </div>
            <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-chart-2 transition-all duration-500" 
                style={{ width: `${supplyPercentage}%` }} 
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                Circulating: {circulatingSupply.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
              <span>
                {maxSupply 
                  ? `Max: ${maxSupply.toLocaleString(undefined, { maximumFractionDigits: 0 })}` 
                  : `Total: ${totalSupply.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                }
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
