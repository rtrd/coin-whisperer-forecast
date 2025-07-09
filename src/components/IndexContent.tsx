import React from "react";
import { IndexHeader } from "@/components/IndexHeader";
import { IndexNavigationCards } from "@/components/IndexNavigationCards";
import WordPressIntegration from "@/components/WordPressIntegration";
import { AITradingSignals } from "@/components/AITradingSignals";
import { AdBanner } from "@/components/AdBanner";
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

      {/* Google Ad - Header 728x90 */}
      <div className="hidden md:flex justify-center mb-6 md:mb-8">
        <div id='div-gpt-ad-1752049298270-0' style={{minWidth: '728px', minHeight: '90px'}}>
          <script 
            dangerouslySetInnerHTML={{
              __html: `googletag.cmd.push(function() { googletag.display('div-gpt-ad-1752049298270-0'); });`
            }}
          />
        </div>
      </div>

      {/* WordPress Integration - Latest Crypto News & Analysis */}
      <WordPressIntegration />

      {/* AI Trading Signals - Restored */}
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

      {/* Footer */}
      <Footer />
    </div>
  );
};
