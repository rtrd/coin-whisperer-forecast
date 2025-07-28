import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useCryptoData } from "@/hooks/useCryptoData";
import { usePrediction } from "@/hooks/usePrediction";
import { useMarketData } from "@/hooks/useMarketData";
import { useCryptoFilters } from "@/hooks/useCryptoFilters";
import { fetchTechnicalIndicators } from "@/services/aiPredictionService";
import { generateMockData } from "@/utils/mockDataGenerator";
import { trackPredictionTool } from "@/utils/analytics";
import { SelectedTokenInfo } from "@/types/tokenAnalysis";

export const useTokenDetail = (
  cryptoId: string,
  selectedToken: SelectedTokenInfo,
  tokenMarketStats: any,
  allTokenMarketStats: any[]
) => {
  const [timeframe, setTimeframe] = useState("7d");
  const [predictionDays, setPredictionDays] = useState(7);
  const [modelType, setModelType] = useState("technical");
  const [showPrediction, setShowPrediction] = useState(false);
  const [sentimentData, setSentimentData] = useState<any>(null);
  const [technicalIndicator, setTechnicalIndicator] = useState<any>(null);

  // Fetch technical indicators
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetchTechnicalIndicators(cryptoId, "3m");
        console.log("Fetched technical indicators:", response);
        const prices = response.map((d) => d.price);
        if (prices[0] == undefined) {
          const data = generateMockData(cryptoId, timeframe, allTokenMarketStats);
          setTechnicalIndicator(data);
        } else {
          setTechnicalIndicator(response);
        }
      } catch (error) {
        console.error("Error fetching technical indicators:", error);
      }
    };

    getData();
  }, [cryptoId, timeframe, allTokenMarketStats]);

  const {
    data: cryptoData,
    isLoading: dataLoading,
    error: dataError,
  } = useCryptoData(cryptoId, timeframe, allTokenMarketStats || []);

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
    tokenMarketStats?.current_price ||
    (cryptoData && cryptoData.length > 0
      ? cryptoData[cryptoData.length - 1]?.price
      : 0);

  const previousPrice =
    cryptoData && cryptoData.length > 1
      ? cryptoData[cryptoData.length - 2]?.price
      : 0;

  const priceChange =
    tokenMarketStats?.price_change_percentage_24h ||
    (currentPrice && previousPrice
      ? ((currentPrice - previousPrice) / previousPrice) * 100
      : 0);

  const { marketData } = useMarketData(
    currentPrice,
    selectedToken?.category,
    cryptoId
  );

  // Create fallback market stats if none provided
  const displayMarketStats = tokenMarketStats || {
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
    if (!technicalIndicator && !cryptoData) {
      toast.error("No data available for prediction");
      return;
    }

    await generatePrediction(
      cryptoData,
      cryptoId,
      predictionDays,
      modelType,
      technicalIndicator,
      sentimentData,
      allTokenMarketStats
    );
    setShowPrediction(true);
    toast.success("Prediction generated successfully!");
  };

  const handleClearPrediction = () => {
    trackPredictionTool("clear", selectedToken?.name, modelType);
    setShowPrediction(false);
    toast.success("Prediction cleared from chart");
  };

  return {
    // State
    timeframe,
    setTimeframe,
    predictionDays,
    setPredictionDays,
    modelType,
    setModelType,
    showPrediction,
    setShowPrediction,
    sentimentData,
    setSentimentData,
    technicalIndicator,

    // Data
    cryptoData,
    prediction,
    allCryptosData,
    currentPrice,
    previousPrice,
    priceChange,
    displayMarketStats,

    // Loading states
    dataLoading,
    predictionLoading,
    filtersLoading,

    // Handlers
    handlePredict,
    handleClearPrediction,
    handleFilterChange,

    // Errors
    dataError,
    filtersError,
  };
};