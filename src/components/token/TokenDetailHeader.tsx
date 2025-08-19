import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { IndexHeader } from "@/components/IndexHeader";
import { AdUnit } from "@/components/ads/AdService";

interface TokenDetailHeaderProps {
  cryptoId: string;
  cryptoOptions: any[];
  currentPrice: number;
  priceChange: number;
}

export const TokenDetailHeader: React.FC<TokenDetailHeaderProps> = ({
  cryptoId,
  cryptoOptions,
  currentPrice,
  priceChange,
}) => {
  return (
    <>

      {/* Homepage Header */}
      <IndexHeader
        selectedCrypto={cryptoId}
        cryptoOptions={cryptoOptions}
        currentPrice={currentPrice}
        priceChange={priceChange}
      />

      {/* Ad Banner Before Price Chart - Centered with more bottom margin */}
      <div className="w-full min-h-[120px] bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden flex items-center justify-center mt-6 mb-8">
        <AdUnit type="leaderboard" className="max-w-full h-full ad-click" />
      </div>
    </>
  );
};
