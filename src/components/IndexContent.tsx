import React, { useEffect } from "react";
import { bitmedialAdService } from "@/services/bitmedialAdService";

declare global {
  interface Window {
    googletag: any;
  }
}
import { IndexHeader } from "@/components/IndexHeader";
import { IndexNavigationCards } from "@/components/IndexNavigationCards";
import { LazyWordPressIntegration } from "@/components/lazy/LazyWordPressIntegration";
import { GAMAdUnit } from "@/components/ads/GAMAdUnit";
import { BitmedialAdContainer } from "@/components/ads/BitmedialAdContainer";
import { CryptoFilters } from "@/components/CryptoFilters";
import { LazyMarketDataWidget } from "@/components/lazy/LazyMarketDataWidget";
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
    // Register ad containers for this page
    bitmedialAdService.registerContainer('home-top');
    bitmedialAdService.registerContainer('home-bottom');

    return () => {
      // Unregister containers when component unmounts
      bitmedialAdService.unregisterContainer('home-top');
      bitmedialAdService.unregisterContainer('home-bottom');
    };
  }, []);

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

      {/* Bitmedia Ad - Top */}
      <BitmedialAdContainer
        id="home-top"
        size="leaderboard"
        className="mb-6 md:mb-8"
      />

      {/* WordPress Integration - Latest Crypto News & Analysis */}
      <LazyWordPressIntegration />

      <div className="mb-8">
        <LockedAITradingSignals />
      </div>

      {/* Crypto Filters - Smart Crypto Filters */}
      <CryptoFilters onFilterChange={handleFilterChange} />

      {/* Market Data Widget - Top 10 by Market Cap */}
      <LazyMarketDataWidget
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

      {/* Bitmedia Ad - Bottom */}
      <BitmedialAdContainer
        id="home-bottom"
        size="leaderboard"
        className="mb-6 md:mb-8"
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};
