
import React from 'react';
import { IndexHeader } from "@/components/IndexHeader";
import { IndexNavigationCards } from "@/components/IndexNavigationCards";
import WordPressIntegration from "@/components/WordPressIntegration";
import { AITradingSignals } from "@/components/AITradingSignals";
import { AdBanner } from "@/components/AdBanner";
import { CryptoFilters } from "@/components/CryptoFilters";
import { MarketDataWidget } from "@/components/MarketDataWidget";
import Footer from "@/components/Footer";

interface IndexContentProps {
  selectedCrypto: string;
  cryptoOptions: any[];
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
  handleFilterChange
}) => {
  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <IndexHeader 
        selectedCrypto={selectedCrypto}
        cryptoOptions={cryptoOptions}
        currentPrice={currentPrice}
        priceChange={priceChange}
      />

      {/* Ad Banner 728x90 - Hidden on mobile */}
      <div className="hidden md:flex justify-center mb-6 md:mb-8">
        <AdBanner width={728} height={90} position="horizontal" />
      </div>

      {/* WordPress Integration - Latest Crypto News & Analysis */}
      <WordPressIntegration />

      {/* AI Trading Signals */}
      <AITradingSignals />

      {/* Crypto Filters - Smart Crypto Filters */}
      <CryptoFilters onFilterChange={handleFilterChange} />

      {/* Market Data Widget - Top 10 by Market Cap */}
      <MarketDataWidget cryptoOptions={filteredCryptos} />

      {/* Navigation Cards to Other Features */}
      <IndexNavigationCards />

      {/* Footer */}
      <Footer />
    </div>
  );
};
