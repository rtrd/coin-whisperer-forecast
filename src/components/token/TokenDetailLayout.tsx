import React, { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";
import { TokenDetailHeader } from "./TokenDetailHeader";
import { TokenDetailInfo } from "./TokenDetailInfo";
import { TokenDetailChart } from "./TokenDetailChart";
import { TokenDetailAnalysis } from "./TokenDetailAnalysis";
import { TokenSidebar } from "./TokenSidebar";
import { TokenDetailOtherTokens } from "./TokenDetailOtherTokens";
import { TokenDetailActions } from "./TokenDetailActions";
import VdoFloatingAd from "@/components/ads/VdoFloatingAd";
import VdoBannerAd from "@/components/ads/VdoBannerAd";
import { InternalLinking, TokenLinks } from "@/components/seo/InternalLinking";
import AdUnit from "@/components/ads/VdoBannerAd";
import { TokenResourcesPanel } from "./TokenResourcesPanel";
import { TokenPriceTimeline } from "./TokenPriceTimeline";
import { TokenPriceAlerts } from "./TokenPriceAlerts";
import { TokenComparison } from "./TokenComparison";
import { TokenDeveloperActivity } from "./TokenDeveloperActivity";
import { TokenMarketMetrics } from "./TokenMarketMetrics";
import { TokenPricePerformance } from "./TokenPricePerformance";
import { useTokenInfo } from "@/hooks/useTokenInfo";

interface TokenDetailLayoutProps {
  // Header props
  cryptoId: string;
  cryptoOptions: any[];
  currentPrice: number;
  priceChange: number;

  // Info props
  marketData: any;

  // Chart props
  cryptoData: any[] | undefined;
  dataLoading: boolean;
  prediction: any;
  showPrediction: boolean;
  timeframe: string;
  setTimeframe: (value: string) => void;
  predictionDays: number;
  setPredictionDays: (value: number) => void;
  modelType: string;
  setModelType: (value: string) => void;
  predictionLoading: boolean;
  handlePredict: () => void;
  handleClearPrediction: () => void;

  // Other props
  tokenId: string;
  selectedToken: any;
  allCryptosData: any[];
  technicalIndicator?: any[]; // Optional, can be undefined if not used
  SentimentData?: (data: any) => void; // Optional sentiment data prop
}

export const TokenDetailLayout: React.FC<TokenDetailLayoutProps> = ({
  cryptoId,
  cryptoOptions,
  currentPrice,
  priceChange,
  marketData,
  cryptoData,
  dataLoading,
  prediction,
  showPrediction,
  timeframe,
  setTimeframe,
  predictionDays,
  setPredictionDays,
  modelType,
  setModelType,
  predictionLoading,
  handlePredict,
  handleClearPrediction,
  tokenId,
  selectedToken,
  allCryptosData,
  SentimentData,
 }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const analysisRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'sentiment' | 'technical' | 'social'>('sentiment');

  const isMobile = window.matchMedia(`(max-width: ${768}px)`).matches;
  const customClass = useMemo(
    () =>
      isMobile ? "flex justify-center !px-4 mb-6" : "flex justify-center mb-6",
    [isMobile]
  );

  const { data: tokenInfo, isLoading: tokenInfoLoading } = useTokenInfo(tokenId);

  const handleNavigateToChart = () => {
    chartRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleNavigateToTab = (tab: 'sentiment' | 'technical' | 'social') => {
    setActiveTab(tab);
    setTimeout(() => {
      analysisRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-4 md:py-8">
        <TokenDetailHeader cryptoOptions={cryptoOptions} />
      </div>

      <div className="container mx-auto px-4 pb-8">
        {/* Back Button */}
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

        {/* Ad Banner Before Price Chart */}
        <AdUnit
          className={customClass}
          isMobile={isMobile}
          adUnit={
            isMobile
              ? "/22181265/pumpparade_mob_300v_1"
              : "/22181265/pumpparade_970v_1"
          }
        />

        {/* Main Content */}
        <div className="space-y-6">
          {/* Token Info Card - Full Width */}
          <TokenDetailInfo
            currentPrice={currentPrice}
            priceChange={priceChange}
            marketData={marketData}
            tokenId={tokenId}
          />

          {/* Price Chart with AI Prediction Engine */}
          <div ref={chartRef}>
            <TokenDetailChart
              cryptoData={cryptoData}
              dataLoading={dataLoading}
              prediction={prediction}
              showPrediction={showPrediction}
              cryptoId={cryptoId}
              currentPrice={currentPrice}
              timeframe={timeframe}
              setTimeframe={setTimeframe}
              predictionDays={predictionDays}
              setPredictionDays={setPredictionDays}
              modelType={modelType}
              setModelType={setModelType}
              predictionLoading={predictionLoading}
              handlePredict={handlePredict}
              handleClearPrediction={handleClearPrediction}
            />
          </div>

          {/* Ad Banner After Price Chart - Responsive */}
          <AdUnit
            className={customClass}
            isMobile={isMobile}
            adUnit={
              isMobile
                ? "/22181265/pumpparade_mob_300v_2"
                : "/22181265/pumpparade_970v_2"
            }
          />

          {/* Ad Banner After Price Chart - Centered */}
          {/* <div className="w-full min-h-[120px] bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
            <AdBanner
              width={728}
              height={120}
              position="horizontal"
              className="max-w-full h-full"
            />
          </div> */}
        </div>

        {/* Enhanced Resources & Alerts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <TokenResourcesPanel 
            tokenInfo={tokenInfo} 
            tokenId={tokenId} 
            isLoading={tokenInfoLoading}
            onNavigateToChart={handleNavigateToChart}
            onNavigateToTab={handleNavigateToTab}
          />
          <TokenPriceAlerts 
            tokenName={selectedToken?.name || tokenId}
            tokenSymbol={selectedToken?.symbol || tokenId}
            currentPrice={currentPrice}
          />
        </div>

        {/* Price Performance Timeline */}
        <div className="mt-6">
          <TokenPriceTimeline
            currentPrice={currentPrice}
            ath={marketData?.ath}
            atl={marketData?.atl}
            priceChange1h={tokenInfo?.market_data?.price_change_percentage_1h_in_currency?.usd}
            priceChange24h={marketData?.price_change_percentage_24h}
            priceChange7d={marketData?.price_change_percentage_7d_in_currency}
            priceChange14d={tokenInfo?.market_data?.price_change_percentage_14d_in_currency?.usd}
            priceChange30d={marketData?.price_change_percentage_30d_in_currency}
            priceChange60d={tokenInfo?.market_data?.price_change_percentage_60d_in_currency?.usd}
            priceChange200d={tokenInfo?.market_data?.price_change_percentage_200d_in_currency?.usd}
            priceChange1y={tokenInfo?.market_data?.price_change_percentage_1y_in_currency?.usd}
            athDate={marketData?.ath_date}
            atlDate={marketData?.atl_date}
          />
        </div>

        {/* Comparison Tool - Full Width */}
        <div className="mt-6">
          <TokenComparison
            tokenSymbol={selectedToken?.symbol || tokenId}
            marketCap={marketData?.market_cap}
            volume24h={marketData?.total_volume}
            priceChange24h={marketData?.price_change_percentage_24h || 0}
          />
        </div>

        {/* Market Analysis and Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 mt-6" ref={analysisRef}>
          {/* Market Analysis - 3/4 width */}
          <div className="lg:col-span-3">
            <TokenDetailAnalysis
              cryptoId={cryptoId}
              cryptoData={cryptoData}
              dataLoading={dataLoading}
              prediction={prediction}
              sentimentData={SentimentData}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              tokenSymbol={selectedToken?.symbol}
              tokenName={selectedToken?.name}
            />
          </div>

          {/* Sidebar with Ad + TokenSidebar + Developer Activity */}
          <div className="lg:col-span-1 space-y-6">
            <VdoBannerAd />
            <TokenSidebar
              currentTokenId={tokenId}
              selectedCrypto={cryptoId}
              currentPrice={currentPrice}
              priceChange={priceChange}
              cryptoOptions={cryptoOptions}
              cryptoData={cryptoData}
            />
            <TokenDeveloperActivity tokenInfo={tokenInfo} isLoading={tokenInfoLoading} />
            <AdUnit
              adUnit={"/22181265/pumpparade_stickyrail"}
              isMobile={isMobile}
              className={customClass}
            />
          </div>
        </div>

        {/* Other Tokens Section */}
        <div className="mt-6">
          <TokenDetailOtherTokens
            tokenId={tokenId}
            cryptoOptions={allCryptosData || []}
          />
        </div>
        <br />

        {/* Ad Banner Before Footer */}
        {/* <div className="w-full min-h-[120px] bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden flex items-center justify-center mt-6">
          <AdBanner
            width={728}
            height={120}
            position="horizontal"
            className="max-w-full h-full"
          />
        </div> */}
        <VdoFloatingAd />
        {/* Internal Linking */}
        <div className="mt-12 mb-8">
          <InternalLinking
            currentPage="token"
            tokenSymbol={selectedToken?.symbol}
            category={selectedToken?.category}
          />
        </div>

        {/* Related Tokens */}
        <div className="mb-8">
          <TokenLinks currentToken={tokenId} />
        </div>

        {/* Footer */}
        <div className="mt-12">
          <Footer />
        </div>

        <AdUnit
          className={customClass}
          isMobile={isMobile}
          adUnit={
            isMobile
              ? "/22181265/pumpparade_mob_stickyfooter"
              : "/22181265/pumpparade_sticky_footer"
          }
        />
      </div>

      {/* Sticky Buy/Sell Buttons */}
      <TokenDetailActions
        selectedToken={selectedToken}
        currentPrice={currentPrice}
      />
    </div>
  );
};
