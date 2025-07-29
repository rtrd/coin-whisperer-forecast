import React, { useEffect } from "react";

declare global {
  interface Window {
    googletag: any;
  }
}
import { IndexHeader } from "@/components/IndexHeader";
import { IndexNavigationCards } from "@/components/IndexNavigationCards";
import WordPressIntegration from "@/components/WordPressIntegration";
import { AITradingSignals } from "@/components/AITradingSignals";
import { GAMAdUnit } from "@/components/ads/GAMAdUnit";
import { CryptoFilters } from "@/components/CryptoFilters";
import { MarketDataWidget } from "@/components/MarketDataWidget";
import Footer from "@/components/Footer";
import { LockedAITradingSignals } from "@/components/LockedAITradingSignals";

interface IndexContentProps {
  selectedCrypto: string;
  cryptoOptions: any[];
  AllCryptosData: any[];
  currentPrice: number;
  priceChange: number;
  filteredCryptos: any[];
  handleFilterChange: (filters: any) => void;
}

export const IndexContent: React.FC<IndexContentProps> = ({
  selectedCrypto,
  cryptoOptions,
  currentPrice,
  priceChange,
  filteredCryptos,
  AllCryptosData,
  handleFilterChange,
}) => {
  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <IndexHeader
        selectedCrypto={selectedCrypto}
        cryptoOptions={cryptoOptions}
        currentPrice={currentPrice}
        priceChange={priceChange}
      />

      {/* Google Ad Manager - Header Ad */}
      <GAMAdUnit
        adUnitId="div-gpt-ad-1752654531765-0"
        size={[728, 90]}
        className="mb-6 md:mb-8"
      />

      {/* WordPress Integration - Latest Crypto News & Analysis */}
      <WordPressIntegration />

      <div className="mb-8">
        <LockedAITradingSignals />
      </div>

      {/* Crypto Filters - Smart Crypto Filters */}
      <CryptoFilters onFilterChange={handleFilterChange} />

      {/* Market Data Widget - Top 10 by Market Cap */}
      <MarketDataWidget
        onMarketDataFilter={handleFilterChange}
        cryptoOptions={filteredCryptos}
        AllCryptosData={AllCryptosData}
      />

      {/* Navigation Cards to Other Features */}
      <IndexNavigationCards />

      {/* Ad Banner Before Footer */}
      <GAMAdUnit
        adUnitId="div-gpt-ad-1752654531765-1"
        size={[728, 90]}
        className="mb-6 md:mb-8"
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};
