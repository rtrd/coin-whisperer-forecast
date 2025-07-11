
import React from 'react';
import { Link } from 'react-router-dom';
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
  priceChange
}) => {
  return (
    <>
      {/* Header with Back Button */}
      <div className="mb-6">
        <Link to="/">
          <Button
            variant="outline"
            className="bg-gray-700/50 border-gray-600 text-white hover:bg-gray-600/50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>

      {/* Homepage Header */}
      <IndexHeader
        selectedCrypto={cryptoId}
        cryptoOptions={cryptoOptions}
        currentPrice={currentPrice}
        priceChange={priceChange}
      />

      {/* Ad Banner Before Price Chart - Centered with more bottom margin */}
      <div className="w-full min-h-[120px] bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden flex items-center justify-center mt-6 mb-8">
        <AdUnit type="leaderboard" className="max-w-full h-full" />
      </div>
    </>
  );
};
