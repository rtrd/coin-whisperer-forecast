import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TokenHeader } from "./TokenHeader";
import { TokenPriceDisplay } from "./TokenPriceDisplay";
import { TokenMarketStats } from "./TokenMarketStats";


interface TokenDetailInfoProps {
  currentPrice: number;
  priceChange: number;
  marketData: any;
  tokenId: string;
  tokenSymbol?: string;
}

export const TokenDetailInfo: React.FC<TokenDetailInfoProps> = ({
  currentPrice,
  priceChange,
  marketData,
  tokenId,
  tokenSymbol,
}) => {
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
              tokenSymbol={tokenSymbol || marketData?.symbol}
            />
          </div>

          {/* Market Statistics */}
          <TokenMarketStats marketData={marketData} />
        </div>
      </CardContent>
    </Card>
  );
};