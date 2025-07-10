import React, { useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { TokenProvider } from "@/contexts/TokenContext";
import { TokenDetailLayout } from "@/components/token/TokenDetailLayout";
import { TokenDataService } from "@/services/tokenDataService";
import { useCryptoData } from "@/hooks/useCryptoData";
import { usePrediction } from "@/hooks/usePrediction";
import { useMarketData } from "@/hooks/useMarketData";
import { toast } from "sonner";
import { getTokenInfo, getCoinGeckoId } from "@/utils/tokenMapping";
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

    await generatePrediction(cryptoData, cryptoId, predictionDays, modelType);
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
      <TokenDetailLayout
        cryptoId={cryptoId}
        cryptoOptions={cryptoOptions}
        currentPrice={currentPrice}
        priceChange={priceChange}
        marketData={displayMarketStats}
        cryptoData={cryptoData}
        dataLoading={dataLoading}
        prediction={prediction}
        showPrediction={showPrediction}
        timeframe={timeframe}
        setTimeframe={setTimeframe}
        predictionDays={predictionDays}
        setPredictionDays={setPredictionDays}
        modelType={modelType}
        setModelType={setModelType}
        predictionLoading={predictionLoading}
        handlePredict={handlePredict}
        handleClearPrediction={handleClearPrediction}
        tokenId={tokenId || "bitcoin"}
        selectedToken={selectedToken}
        allCryptosData={allCryptosData}
      />
    </TokenProvider>
  );
};

export default TokenDetail;
