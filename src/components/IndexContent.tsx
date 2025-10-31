import React, { useEffect, useMemo, useState } from "react";

declare global {
  interface Window {
    googletag: any;
  }
}
import { IndexHeader } from "@/components/IndexHeader";
import { IndexNavigationCards } from "@/components/IndexNavigationCards";
import { LazyWordPressIntegration } from "@/components/lazy/LazyWordPressIntegration";
// import { GAMAdUnit } from "@/components/ads/GAMAdUnit";
import { CryptoFilters } from "@/components/CryptoFilters";
import { LazyMarketDataWidget } from "@/components/lazy/LazyMarketDataWidget";
import Footer from "@/components/Footer";
import VdoFloatingAd from "@/components/ads/VdoFloatingAd";
import VdoBannerAd from "@/components/ads/VdoBannerAd";
import { LockedAITradingSignals } from "@/components/LockedAITradingSignals";
import { useIsMobile } from "@/hooks/useIsMobile";
import AdUnit from "@/components/ads/VdoBannerAd";

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
  // const isMobile = useIsMobile();
  const isMobile = window.matchMedia(`(max-width: ${768}px)`).matches;

  const customClass = useMemo(
    () => (isMobile ? "flex justify-center !px-4 mb-6" : "flex justify-center mb-6"),
    [isMobile]
  );

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <IndexHeader
        selectedCrypto={selectedCrypto}
        cryptoOptions={cryptoOptions}
        currentPrice={currentPrice}
        priceChange={priceChange}
      />

      {/* Google Ad Manager - Header Ad */}

      <AdUnit
        className={customClass}
        isMobile={isMobile}
        adUnit={
          isMobile
            ? "/22181265/pumpparade_mob_300v_1"
            : "/22181265/pumpparade_970v_1"
        }
      />

      {/* WordPress Integration - Latest Crypto News & Analysis */}
      <LazyWordPressIntegration />
      <div className="my-6 md:my-8">
        {/* <VdoBannerAd/>
         <VdoFloatingAd/> */}
        <AdUnit
          className={customClass}
          isMobile={isMobile}
          adUnit={
            isMobile
              ? "/22181265/pumpparade_mob_300v_2"
              : "/22181265/pumpparade_970v_2"
          }
        />
      </div>
      <div className="mb-8">
        <LockedAITradingSignals />
      </div>

      <AdUnit
        className={customClass}
        adUnit={
          isMobile
            ? "/22181265/pumpparade_mob_300v_3"
            : "/22181265/pumpparade_970v_3"
        }
      />

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
      {/* <GAMAdUnit
        adUnitId="div-gpt-ad-1752654531765-1"
        size={[728, 90]}
        className="mb-6 md:mb-8"
      /> */}
      {/* <div className="mb-8">
          <LockedAITradingSignals />
        </div> */}
      {/* Ad Banner Before Footer */}
      {/* <GAMAdUnit
        adUnitId="div-gpt-ad-1752654531765-1"
        size={[728, 90]}
        className="mb-6 md:mb-8"
      /> */}
      {/* Footer */}
      <Footer />
      <AdUnit
        className={customClass}
        adUnit={
          isMobile
            ? "/22181265/pumpparade_mob_stickyfooter"
            : "/22181265/pumpparade_sticky_footer"
        }
      />
    </div>
  );
};
