import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { AdBanner } from "@/components/AdBanner";
import Footer from "@/components/Footer";
import { TokenProvider } from "@/contexts/TokenContext";
import { TokenHeader } from "@/components/token/TokenHeader";
import { TokenPriceDisplay } from "@/components/token/TokenPriceDisplay";
import { TokenMarketStats } from "@/components/token/TokenMarketStats";
import { TokenSidebar } from "@/components/token/TokenSidebar";
import { TokenDetailHeader } from "@/components/token/TokenDetailHeader";
import { TokenDetailChart } from "@/components/token/TokenDetailChart";
import { TokenDetailAnalysis } from "@/components/token/TokenDetailAnalysis";
import { TokenDetailOtherTokens } from "@/components/token/TokenDetailOtherTokens";
import { TokenDetailActions } from "@/components/token/TokenDetailActions";
import { TokenDataService } from "@/services/tokenDataService";
import { useCryptoData } from "@/hooks/useCryptoData";
import { usePrediction } from "@/hooks/usePrediction";
import { useMarketData } from "@/hooks/useMarketData";
import { toast } from "sonner";
import { getTokenInfo, getCoinGeckoId } from "@/utils/tokenMapping";
import { getAllCryptos } from "../../utils/api";
import { CryptoToken } from "@/types/crypto";
import { useCryptoFilters } from "@/hooks/useCryptoFilters";
const TokenDetail = () => {
  const { tokenId } = useParams<{ tokenId: string }>();
  const location = useLocation();
  const tokenmarketstats = location.state?.token;
  const [timeframe, setTimeframe] = useState("7d");
  const [predictionDays, setPredictionDays] = useState(7);
  const [modelType, setModelType] = useState("technical");
  const [showPrediction, setShowPrediction] = useState(false);

  // Get token info and crypto options
  const selectedToken = getTokenInfo(tokenId || "bitcoin");
  const cryptoId = getCoinGeckoId(tokenId || "bitcoin");
  const cryptoOptions = TokenDataService.getCryptoOptions();

  const {
    data: cryptoData,
    isLoading: dataLoading,
    error: dataError,
  } = useCryptoData(cryptoId, timeframe);
  const {
    prediction,
    isLoading: predictionLoading,
    generatePrediction,
  } = usePrediction();
  const {
    filteredCryptos,
    allCryptosData,
    handleFilterChange,
    isLoading: filtersLoading,
    error: filtersError,
  } = useCryptoFilters();

  const currentPrice =
    tokenmarketstats?.current_price ||
    (cryptoData && cryptoData.length > 0
      ? cryptoData[cryptoData.length - 1]?.price
      : 0);
  const previousPrice =
    cryptoData && cryptoData.length > 1
      ? cryptoData[cryptoData.length - 2]?.price
      : 0;
  const priceChange =
    tokenmarketstats?.price_change_percentage_24h ||
    (currentPrice && previousPrice
      ? ((currentPrice - previousPrice) / previousPrice) * 100
      : 0);

  const { marketData } = useMarketData(
    currentPrice,
    selectedToken?.category,
    cryptoId
  );

  // Create fallback market stats if none provided
  const displayMarketStats = tokenmarketstats || {
    current_price: currentPrice,
    price_change_percentage_24h: priceChange,
    market_cap: marketData.marketCap,
    total_volume: marketData.volume24h,
    circulating_supply: marketData.circulatingSupply,
    total_supply: marketData.totalSupply,
    ath: marketData.allTimeHigh,
    atl: marketData.allTimeLow,
    price_change_percentage_7d_in_currency: marketData.priceChange7d,
    price_change_percentage_30d_in_currency: marketData.priceChange30d,
  };

  const handlePredict = async () => {
    if (!cryptoData) {
      toast.error("No data available for prediction");
      return;
    }

    await generatePrediction(cryptoData, cryptoId, predictionDays);
    setShowPrediction(true);
    toast.success("Prediction generated successfully!");
  };

  const handleClearPrediction = () => {
    setShowPrediction(false);
    toast.success("Prediction cleared from chart");
  };

  if (!selectedToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">
              Token Not Found
            </h1>
            <p className="text-gray-300 mb-4">
              The token "{tokenId}" could not be found.
            </p>
            <Link to="/">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <TokenProvider tokenId={tokenId || "bitcoin"} cryptoOptions={cryptoOptions}>
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
            <Card className="bg-gray-800/50 border-gray-700 shadow-2xl backdrop-blur-sm overflow-hidden">
              <CardContent className="p-8">
                <div className="space-y-8">
                  {/* Token Info Section */}
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                    <TokenHeader />
                    <TokenPriceDisplay
                      currentPrice={currentPrice}
                      priceChange={priceChange}
                    />
                  </div>

                  {/* Market Statistics */}
                  <TokenMarketStats marketData={displayMarketStats} />
                </div>
              </CardContent>
            </Card>

            {/* Price Chart with AI Prediction Engine */}
            <TokenDetailChart
              cryptoData={cryptoData}
              dataLoading={dataLoading}
              prediction={prediction}
              showPrediction={showPrediction}
              cryptoId={cryptoId}
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
            <div className="w-full min-h-[120px] bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
              <AdBanner
                width={728}
                height={120}
                position="horizontal"
                className="max-w-full h-full"
              />
            </div>
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
              />
            </div>

            {/* Sidebar - 1/4 width */}
            <div className="lg:col-span-1">
              <TokenSidebar
                currentTokenId={tokenId || "bitcoin"}
                selectedCrypto={cryptoId}
                currentPrice={currentPrice}
                priceChange={priceChange}
                cryptoOptions={cryptoOptions}
              />
            </div>
          </div>

          {/* Other Tokens Section */}
          <div className="mt-6">
            <TokenDetailOtherTokens
              tokenId={tokenId || "bitcoin"}
              cryptoOptions={allCryptosData || []}
            />
          </div>

          {/* Ad Banner Before Footer */}
          <div className="w-full min-h-[120px] bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden flex items-center justify-center mt-6">
            <AdBanner
              width={728}
              height={120}
              position="horizontal"
              className="max-w-full h-full"
            />
          </div>

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
    </TokenProvider>
  );
};

export default TokenDetail;
