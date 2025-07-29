import React from "react";
// import { AdBanner } from "@/components/AdBanner";
import Footer from "@/components/Footer";
import { TokenDetailHeader } from "./TokenDetailHeader";
import { TokenDetailInfo } from "./TokenDetailInfo";
import { TokenDetailChart } from "./TokenDetailChart";
import { TokenDetailAnalysis } from "./TokenDetailAnalysis";
import { TokenSidebar } from "./TokenSidebar";
import { TokenDetailOtherTokens } from "./TokenDetailOtherTokens";
import { TokenDetailActions } from "./TokenDetailActions";
import { GAMAdUnit } from "@/components/ads/GAMAdUnit";

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
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        <TokenDetailHeader
          cryptoId={cryptoId}
          cryptoOptions={cryptoOptions}
          currentPrice={currentPrice}
          priceChange={priceChange}
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

          {/* Ad Banner After Price Chart - Centered */}
          <div className="w-full min-h-[120px] bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden flex items-center justify-center mt-6">
            <GAMAdUnit
              adUnitId="div-gpt-ad-1752654531765-2"
              size={[728, 120]}
              className="max-w-full h-full"
            />
          </div>

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

        {/* Market Analysis and Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          {/* Market Analysis - 3/4 width */}
          <div className="lg:col-span-3">
            <TokenDetailAnalysis
              cryptoId={cryptoId}
              cryptoData={cryptoData}
              dataLoading={dataLoading}
              prediction={prediction}
              sentimentData={SentimentData} // Pass sentiment data prop
            />
          </div>

          {/* Sidebar - 1/4 width */}
          <div className="lg:col-span-1">
            <TokenSidebar
              currentTokenId={tokenId}
              selectedCrypto={cryptoId}
              currentPrice={currentPrice}
              priceChange={priceChange}
              cryptoOptions={cryptoOptions}
              cryptoData={cryptoData}
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

        {/* Ad Banner Before Footer */}
        {/* <div className="w-full min-h-[120px] bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden flex items-center justify-center mt-6">
          <AdBanner
            width={728}
            height={120}
            position="horizontal"
            className="max-w-full h-full"
          />
        </div> */}

        {/* Footer */}
        <div className="mt-12">
          <Footer />
        </div>
      </div>

      {/* Sticky Buy/Sell Buttons */}
      <TokenDetailActions
        selectedToken={selectedToken}
        currentPrice={currentPrice}
      />
    </div>
  );
};
