import React, { useEffect, Suspense } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";

declare global {
  interface Window {
    googletag: any;
  }
}
import { IndexHeader } from "@/components/IndexHeader";
import { MainNavigation } from "@/components/MainNavigation";
import { IndexNavigationCards } from "@/components/IndexNavigationCards";
import { LazyWordPressIntegration } from "@/components/lazy/LazyWordPressIntegration";
import { CryptoFilters } from "@/components/CryptoFilters";
import { LazyMarketDataWidget } from "@/components/lazy/LazyMarketDataWidget";
import Footer from "@/components/Footer";
import { LockedAITradingSignals } from "@/components/LockedAITradingSignals";
import { Skeleton } from "@/components/ui/skeleton";

interface IndexContentProps {
  selectedCrypto: string;
  cryptoOptions: any[];
  AllCryptosData: any[];
  currentPrice: number;
  priceChange: number;
  filteredCryptos: any[];
  handleFilterChange: (filters: any) => void;
}

const LoadingFallback = () => (
  <div className="space-y-4">
    <Skeleton className="h-32 w-full" />
    <Skeleton className="h-64 w-full" />
  </div>
);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative pt-12">
      {/* Navigation - Fixed at top */}
      <ErrorBoundary>
        <MainNavigation />
      </ErrorBoundary>

      <div className="container mx-auto px-4 py-4 md:py-8">
        <ErrorBoundary>
          <IndexHeader
            selectedCrypto={selectedCrypto}
            cryptoOptions={cryptoOptions}
            currentPrice={currentPrice}
            priceChange={priceChange}
          />
        </ErrorBoundary>
      </div>

      <div className="container mx-auto px-4 pb-8">
        {/* WordPress Integration - Latest Crypto News & Analysis */}
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <LazyWordPressIntegration />
          </Suspense>
        </ErrorBoundary>

        <div className="mb-8">
          <ErrorBoundary>
            <LockedAITradingSignals />
          </ErrorBoundary>
        </div>

        {/* Market Data Widget with Integrated Smart Filters */}
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <LazyMarketDataWidget
              onMarketDataFilter={handleFilterChange}
              cryptoOptions={filteredCryptos}
              AllCryptosData={AllCryptosData}
            />
          </Suspense>
        </ErrorBoundary>

        {/* Navigation Cards to Other Features */}
        <ErrorBoundary>
          <IndexNavigationCards />
        </ErrorBoundary>

        {/* Footer */}
        <ErrorBoundary>
          <Footer />
        </ErrorBoundary>
      </div>
    </div>
  );
};
