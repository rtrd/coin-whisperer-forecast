import React from "react";
import { IndexHeader } from "@/components/IndexHeader";
import { IndexNavigationCards } from "@/components/IndexNavigationCards";
import WordPressIntegrationOptimized from "@/components/WordPressIntegrationOptimized";
import { CryptoFilters } from "@/components/CryptoFilters";
import { LazyMarketDataWidget } from "@/components/lazy/LazyMarketDataWidget";
import Footer from "@/components/Footer";
import { LockedAITradingSignals } from "@/components/LockedAITradingSignals";
import { PortfolioAnalysisBanner } from "@/components/PortfolioAnalysisBanner";

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

      {/* Portfolio Analysis Banner */}
      <div className="mb-8">
        <PortfolioAnalysisBanner />
      </div>

      {/* WordPress Integration - Latest Crypto News & Analysis */}
      <WordPressIntegrationOptimized />
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

      {/* Footer */}
      <Footer />
    </div>
  );
};
