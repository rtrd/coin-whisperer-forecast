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
import { AdUnit } from "@/components/ads/AdService";
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
  useEffect(() => {
    // Ensure googletag is available and display the ad
    if (window.googletag && window.googletag.display) {
      window.googletag.display('div-gpt-ad-1752049298270-0');
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <IndexHeader
        selectedCrypto={selectedCrypto}
        cryptoOptions={cryptoOptions}
        currentPrice={currentPrice}
        priceChange={priceChange}
      />

      {/* Google Ad - Below Headline */}
      <div className="flex justify-center mb-6 md:mb-8">
        <div id='div-gpt-ad-1752049298270-0' style={{minWidth: '728px', minHeight: '90px'}}></div>
      </div>

      {/* WordPress Integration - Latest Crypto News & Analysis */}
      <WordPressIntegration />

      {/* AI Trading Signals - Restored */}
      <div className="mb-8">
        <AITradingSignals />
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

      {/* Footer */}
      <Footer />
    </div>
  );
};
