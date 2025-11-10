import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TokenHeader } from "./TokenHeader";
import { TokenPriceDisplay } from "./TokenPriceDisplay";
import { TokenMarketStats } from "./TokenMarketStats";
import { TokenQuickStats } from "./TokenQuickStats";
import { useTokenInfo } from "@/hooks/useTokenInfo";

interface TokenDetailInfoProps {
  currentPrice: number;
  priceChange: number;
  marketData: any;
  tokenId: string;
}

export const TokenDetailInfo: React.FC<TokenDetailInfoProps> = ({
  currentPrice,
  priceChange,
  marketData,
  tokenId,
}) => {
  const { data: tokenInfo, isLoading: tokenInfoLoading } = useTokenInfo(tokenId);

  return (
    <Card className="bg-gray-800/50 border-gray-700 shadow-2xl backdrop-blur-sm overflow-hidden">
      <CardContent className="p-8">
        <div className="space-y-8">
          {/* Token Info Section */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <TokenHeader tokenId={tokenId} />
            <TokenPriceDisplay
              currentPrice={currentPrice}
              priceChange={priceChange}
              tokenSymbol={marketData?.symbol}
            />
          </div>

          {/* Quick Stats Grid - NEW */}
          <TokenQuickStats
            marketCapRank={tokenInfo?.market_cap_rank || marketData?.market_cap_rank}
            marketCap={marketData?.market_cap}
            totalVolume={marketData?.total_volume}
            circulatingSupply={marketData?.circulating_supply}
            totalSupply={marketData?.total_supply}
            maxSupply={marketData?.max_supply}
            fdv={marketData?.fully_diluted_valuation}
          />

          {/* Market Statistics */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Market Statistics</h2>
            <TokenMarketStats marketData={marketData} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};